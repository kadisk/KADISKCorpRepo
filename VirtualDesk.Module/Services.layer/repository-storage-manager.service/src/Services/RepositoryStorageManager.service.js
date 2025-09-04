const { join, resolve} = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeRepositoryPersistentStoreManager = require("../Helpers/InitializeRepositoryPersistentStoreManager")
const CreateItemIndexer                          = require("../Helpers/CreateItemIndexer")
const CreateRepositoryStorageDomainService       = require("../Helpers/CreateRepositoryStorageDomainService")
const PrepareDirPath                             = require("../Helpers/PrepareDirPath")

const RepositoryStorageManagerService = (params) => {

const {
        onReady,
        ecosystemDefaultsFileRelativePath,
        importedRepositoriesSourceCodeDirPath,
        repositoryStorageFilePath,
        ecosystemdataHandlerService,
        extractTarGzLib,
        loadMetatadaDirLib,
        jsonFileUtilitiesLib
    } = params

    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")
    const ExtractTarGz    = extractTarGzLib.require("ExtractTarGz")
    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const absolutRepositoryStorageFilePath = ConvertPathToAbsolutPath(repositoryStorageFilePath)
    const absolutImportedRepositoriesSourceCodeDirPath = ConvertPathToAbsolutPath(importedRepositoriesSourceCodeDirPath)
    const RepositoryPersistentStoreManager = InitializeRepositoryPersistentStoreManager(absolutRepositoryStorageFilePath)

    const {
        RepositoryNamespace : RepositoryNamespaceModel,
        RepositoryImported  : RepositoryImportedModel,
        RepositoryItem      : RepositoryItemModel
    } = RepositoryPersistentStoreManager.models
    
    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const RepositoryStorageDomainService = CreateRepositoryStorageDomainService({
        RepositoryNamespaceModel,
        RepositoryImportedModel,
        RepositoryItemModel
    })

    const {
        GetPackageById,
        GetRepositoryNamespaceId,
        GetItemById,
        ListLatestPackageItemsByUserId,
        ListRepositoriesByUserId,
        ListRepositoriesByNamespace,
        GetNamespace,
        RegisterRepositoryNamespace,
        RegisterRepositoryImported,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetRepositoryImportedByNamespace
    } = RepositoryStorageDomainService

    const _MountPathImportedRepositoriesSourceCodeDirPath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutImportedRepositoriesSourceCodeDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const _Start = async () => {
        await RepositoryPersistentStoreManager.ConnectAndSync()
        onReady()
    }

    const CountNamespaceByUserId = (userId) =>  RepositoryNamespaceModel.count({ where: { userId } })


    const ListRepositoryNamespace = async (userId) => {
        const repositoryNamespaceDataList  = await RepositoryStorageDomainService.ListRepositoryNamespace(userId)
        
        const repositories = repositoryNamespaceDataList
            .map((repositoryData) => {
                const { id, namespace, createdAt } = repositoryData
                return { id, namespace, createdAt } 
            })

        return repositories
    }

    const ListRepositories = async (namespaceId) => {
        const repositories = await ListRepositoriesByNamespace(namespaceId)
        return repositories.map(({ id, createdAt, sourceType, sourceParams }) => ({
            id,
            createdAt,
            sourceType,
            sourceParams
        }))
    }

    const CreateRepository = async ({ namespaceId, repositoryCodePath, sourceType, sourceParams }) => {

        const newRepositoryImported = await RegisterRepositoryImported({ 
                namespaceId,
                repositoryCodePath, 
                sourceType, 
                sourceParams
            })
            
        return newRepositoryImported
    }

    const RegisterImportedRepository = async ({
            namespaceId,
            repositoryCodePath,
            sourceType,
            sourceParams
    }) => {

        const repositoryImportedData = await CreateRepository({
            namespaceId, 
            repositoryCodePath,
            sourceType,
            sourceParams
        })

        ItemIndexer.IndexRepository({
            repositoryId: repositoryImportedData.id,
            repositoryCodePath
        })

        return repositoryImportedData

    }

    const CreateNamespace = async ({ userId, repositoryNamespace }) => {
        const existingNamespaceId = await GetRepositoryNamespaceId(repositoryNamespace)

        if (existingNamespaceId !== undefined) 
            throw new Error('Repository Namespace already exists')

        const newNamespaceData = await RegisterRepositoryNamespace({ namespace: repositoryNamespace , userId })
            
        return newNamespaceData
    }

    const RegisterNamespaceAndRepositoryUploadedAndExtract = async ({ repositoryNamespace, userId, username , repositoryFilePath }) => {
        
        const namespaceData = await CreateNamespace({ userId, repositoryNamespace })
        
        const repositoryImportedData = await ExtractAndRegisterRepository({ 
            username, 
            repositoryNamespace,
            namespaceId: namespaceData.id,
            repositoryFilePath
        })

        return {
            repositoryNamespace: namespaceData,
            repositoryImported: repositoryImportedData
        }
    }

    const ExtractAndRegisterRepository = async ({ namespaceId, username, repositoryNamespace, repositoryFilePath }) => {
        
        const repositoriesCodePath = _MountPathImportedRepositoriesSourceCodeDirPath({ username, repositoryNamespace })
        
        const newRepositoryCodePath = await ExtractTarGz(repositoryFilePath, repositoriesCodePath)

        const repositoryImportedData = await RegisterImportedRepository({
            namespaceId,
            repositoryCodePath: newRepositoryCodePath,
            sourceType:"TAR_GZ_UPLOAD",
            sourceParams: {
                repositoryFilePath
            }
        })

        return repositoryImportedData
    }

    const RegisterNamespaceAndRepositoryCloned = async ({
            userId, 
            repositoryNamespace, 
            repositoryCodePath,
            sourceParams
    }) => {

        const namespaceData = await CreateNamespace({ userId, repositoryNamespace })
        
        const repositoryImportedData = await RegisterImportedRepository({
            namespaceId: namespaceData.id,
            repositoryCodePath,
            sourceType:"GIT_CLONE",
            sourceParams
        })
        
        return {
            repositoryNamespace: namespaceData,
            repositoryImported: repositoryImportedData
        }
    }

    const GetMetadataByPackageId = async (packageId) => { 
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const packageData = await GetItemById(packageId)

        const packageAbsolutPath = join(packageData.repositoryCodePath, packageData.itemPath)
        console.log(`[INFO] Loading metadata for package item at path: ${packageAbsolutPath}`)

        const metadata = await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
            path: packageAbsolutPath
        })

        return {
            schema : metadata["startup-params-schema"],
            value  : metadata["startup-params"],
        }

    }

    const ListBootablePackages = async ({ userId, username }) => {

        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)
        const packageItems  = await ListLatestPackageItemsByUserId(userId)
        console.log(`[INFO] Found ${packageItems.length} package items for user ${username} userId ${userId}`)

        const packageItemsWithMetadataPromises = packageItems
            .map(async (packageItem) => {

                const packageAbsolutPath = join(packageItem.repositoryCodePath, packageItem.itemPath)
                console.log(`[INFO] Loading metadata for package item at path: ${packageAbsolutPath}`)

                const metadata = await LoadMetadataDir({
                    metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
                    path: packageAbsolutPath
                })

                return {
                    ...packageItem,
                    metadata
                }
            })


        const allPackageItems = await Promise.all(packageItemsWithMetadataPromises)
        const bootablePacakgeItems = allPackageItems.filter(({metadata}) => metadata && metadata.boot)
        return bootablePacakgeItems
        
    }

    _Start()

    return {
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        CountNamespaceByUserId, 
        GetPackageById,
        ListRepositoriesByUserId,
        ListRepositories,
        ListRepositoryNamespace,
        GetNamespace,
        GetMetadataByPackageId,
        ListBootablePackages,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetItemById,
        GetRepositoryImportedByNamespace
    }
}

module.exports = RepositoryStorageManagerService
