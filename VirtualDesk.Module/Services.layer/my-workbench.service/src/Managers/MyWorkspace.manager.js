const { resolve, join } = require("path")
const { readFile } = require('node:fs/promises')

const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const DownloadFile                     = require("../Helpers/DownloadFile")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
const ListFilesRecursive               = require("../Helpers/ListFilesRecursive")
const CreateMyWorkspaceDomainService   = require("../Helpers/CreateMyWorkspaceDomainService")

const MyWorkspaceManager = (params) => {

    const {
        onReady,
        storageFilePath,
        ecosystemDefaultsFileRelativePath,
        repositoriesSourceCodeDirPath,
        extractTarGzLib,
        jsonFileUtilitiesLib,
        ecosystemdataHandlerService,
        repositoryStorageManagerService,
        loadMetatadaDirLib
    } = params

    const absolutStorageFilePath         = ConvertPathToAbsolutPath(storageFilePath)
    const absolutRepositoryEditorDirPath = ConvertPathToAbsolutPath(repositoriesSourceCodeDirPath)

    const ExtractTarGz    = extractTarGzLib.require("ExtractTarGz")
    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")
    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const PersistentStoreManager = InitializePersistentStoreManager(absolutStorageFilePath)
    const {
        Repository     : RepositoryModel,
        RepositoryItem : RepositoryItemModel
    } = PersistentStoreManager.models

    const ItemIndexer              = CreateItemIndexer({RepositoryItemModel})
    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({ RepositoryModel, RepositoryItemModel })

    const _Start = async () => {
        await PersistentStoreManager.ConnectAndSync()
        onReady()
    }

    _Start()

    const _GetPrepareAndRepositoriesCodePath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutRepositoryEditorDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const CreateNewRepository = async ({userId, repositoryCodePath, repositoryNamespace}) => {
        const existingNamespace = await repositoryStorageManagerService.GetRepositoryImportedByNamespace(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        //const newRepository = await repositoryStorageManagerService.CreateRepository({ repositoryNamespace , userId, repositoryCodePath })
        return newRepository
    }

    const ImportRepository = async ({ repositoryNamespace, sourceCodeURL, userId, username }) => {

        const repositoriesCodePath = _GetPrepareAndRepositoriesCodePath({username, repositoryNamespace})
        
        const filePath = await DownloadFile({ 
            url: sourceCodeURL, 
            destinationPath: repositoriesCodePath
        })
        const newRepositoryCodePath = await ExtractTarGz(filePath, repositoriesCodePath)
        
        const repoData = await CreateNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath})

        ItemIndexer.IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData

    }

    const RegisterNamespaceAndRepositoryUploadedAndExtract = async ({ repositoryNamespace, userId, username , repositoryFilePath }) => {
        const repositoriesCodePath = _GetPrepareAndRepositoriesCodePath({username, repositoryNamespace})

        const newRepositoryCodePath = await ExtractTarGz(repositoryFilePath, repositoriesCodePath)
        const repoData = await CreateNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath})

        ItemIndexer.IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData
    }

    const GetItemHierarchy = async (repositoryId) => {

        const items = await repositoryStorageManagerService.ListItemByRepositoryId(repositoryId)

        const __BuildTree = (parentId = null) => {
            return items
                .filter(item => item.parentId === parentId)
                .map(item => ({
                    id: item.id,
                    itemName: item.itemName,
                    itemType: item.itemType,
                    children: __BuildTree(item.id)
                }))
        }

        return __BuildTree()
    }

    const GetRepositoryGeneralInformation = async (namespaceId) => {
        const namespaceData = await repositoryStorageManagerService.GetNamespace(namespaceId)
        return {
            repositoryNamespace: namespaceData.namespace
        }
    }

    const GetRepositoryMetadata = async (repositoryId) => {
        const repositoryData = await repositoryStorageManagerService.GetRepositoryImported(repositoryId)
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        return await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
            path: repositoryData.repositoryCodePath
        })
    }

    const GetApplicationsRepositoryMetatadata = async(repositoryId) => {
        const packageMetadata = await GetRepositoryMetadata(repositoryId)
        return packageMetadata.applications
    }

    const GetItemInformation = async (itemId) => {

        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { id, itemName, itemType } = itemData
        return { id, itemName, itemType }

    }

    const GetPackageSourceTree = async (itemId) => {
        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { itemPath } = itemData
        const srcPath = resolve(itemPath, "src")
        
        try {
            return await ListFilesRecursive(srcPath, srcPath)
        } catch (error) {
            throw new Error(`Error reading source tree: ${error.message}`)
        }
    }

    const GetPackageSourceFileContent = async ({itemId, sourceFilePath}) => {
        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { itemPath, itemName, itemType } = itemData

        const absolutePath = join(itemPath, "src", sourceFilePath)

        try {
            const content = await readFile(absolutePath, "utf8")
            return {
                sourceFilePath,
                packageParent:`${itemName}.${itemType}`,
                parentItemId: itemId,
                content
            }
        } catch (error) {
            throw new Error(`Error reading file: ${error.message}`)
        }
    }

    const GetPackageMetadata = async (itemId) => {
        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { itemPath} = itemData
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        return await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.PKG_CONF_DIRNAME_METADATA,
            path: itemPath
        })
    }

    return {
        CreateNewRepository,
        ImportRepository,
        GetItemHierarchy,
        GetRepositoryGeneralInformation,
        GetApplicationsRepositoryMetatadata,
        GetItemInformation,
        GetPackageSourceTree,
        GetPackageSourceFileContent,
        GetPackageMetadata,
        RegisterNamespaceAndRepositoryUploadedAndExtract
    }

}

module.exports = MyWorkspaceManager