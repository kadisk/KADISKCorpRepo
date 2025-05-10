const { join, resolve} = require("path")

const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
const CreateMyWorkspaceDomainService   = require("../Helpers/CreateMyWorkspaceDomainService")

const MyServicesManager = (params) => {

    const {
        onReady,
        storageFilePath,
        repositoriesSourceCodeDirPath,
        ecosystemDefaultsFileRelativePath,
        ecosystemdataHandlerService,
        extractTarGzLib,
        loadMetatadaDirLib,
        jsonFileUtilitiesLib
    } = params

    const ExtractTarGz = extractTarGzLib.require("ExtractTarGz")
    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")
    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const absolutStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)
    const absolutRepositoryEditorDirPath = ConvertPathToAbsolutPath(repositoriesSourceCodeDirPath)

    const PersistentStoreManager = InitializePersistentStoreManager(absolutStorageFilePath)
    const {
        Repository         : RepositoryModel,
        RepositoryItem     : RepositoryItemModel,
        ProvisionedService : ProvisionedServiceModel,
        ImageBuildHistory  : ImageBuildHistoryModel,
        ServiceInstance    : ServiceInstanceModel
    } = PersistentStoreManager.models

    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
        RepositoryModel, 
        RepositoryItemModel, 
        ProvisionedServiceModel,
        ImageBuildHistoryModel,
        ServiceInstanceModel
    })

    const _GetPrepareAndRepositoriesCodePath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutRepositoryEditorDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }


    const _Start = async () => {
        await PersistentStoreManager.ConnectAndSync()
        onReady()
    }

    _Start()

    const SaveUploadedRepository = async ({ repositoryNamespace, userId, username , repositoryFilePath }) => {
        const repositoriesCodePath = _GetPrepareAndRepositoriesCodePath({username, repositoryNamespace})

        const newRepositoryCodePath = await ExtractTarGz(repositoryFilePath, repositoriesCodePath)
        const repoData = await RecordNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath})

        ItemIndexer.IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData
    }

    const RecordNewRepository = async ({userId, repositoryCodePath, repositoryNamespace}) => {
        const existingNamespace = await MyWorkspaceDomainService.GetRepository.ByNamespace(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        const newRepository = await MyWorkspaceDomainService
            .RegisterRepository({ repositoryNamespace , userId, repositoryCodePath })
        return newRepository
    }

    const GetStatus = async (userId) => {
        const repositoryCount = await RepositoryModel.count({ where: { userId } });
    
        if (repositoryCount > 0) {
            return "READY"
        } else {
            return "NO_REPOSITORIES"
        }
    }

    const ListBootablePackages = async ({ userId, username }) => {

        const packageItems  = await MyWorkspaceDomainService.ListPackageItemByUserId(userId)

        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const packageItemsWithMetadataPromises = packageItems
            .map(async (packageItem) => {

                const metadata = await LoadMetadataDir({
                    metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
                    path: packageItem.itemPath
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

    const ListApplications = async (userId) => {

        const repositories  = await MyWorkspaceDomainService.ListRepositories(userId)

        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const repositoriesDataPromises = repositories
            .map(async (repository) => {
                const metadata = await LoadMetadataDir({
                    metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
                    path: repository.repositoryCodePath
                })
                return {
                    repository,
                    metadata
                }
            })

        const repositoriesData = await Promise.all(repositoriesDataPromises)

        const applications = repositoriesData
            .reduce((acc, { repository, metadata }) => {

                const { applications } = metadata
                if (applications) {
                    const applicationData = applications.map((application) => ({
                        type: application.appType,
                        executableName: application.executable,
                        repositoryNamespace: repository.namespace,
                        package: application.packageNamespace,
                        repositoryId: repository.id,
                    }))
                    return [...acc, ...applicationData]
                }
                return acc

            }, [])

        return applications

    }

    const ListRepositories = async (userId) => {
        const repositoriesData  = await MyWorkspaceDomainService.ListRepositories(userId)
        
        const repositories = repositoriesData
            .map((repositoryData) => {
                const { id, namespace } = repositoryData
                return { id, namespace } 
            })

        return repositories
    }

    const ListProvisionedServices = (userId) => {
        return MyWorkspaceDomainService.ListProvisionedServices(userId)
    }

    return {
        SaveUploadedRepository,
        GetStatus,
        ListBootablePackages,
        ListApplications,
        ListRepositories,
        ListProvisionedServices,
        GetRepository               : MyWorkspaceDomainService.GetRepository,
        GetPackageById              : MyWorkspaceDomainService.GetPackageItemById,
        GetPackageByPath            : MyWorkspaceDomainService.GetPackageItemByPath,
        RegisterServiceProvisioning : MyWorkspaceDomainService.RegisterServiceProvisioning,
        RegisterBuildedImage        : MyWorkspaceDomainService.RegisterBuildedImage,
        RegisterServiceInstance     : MyWorkspaceDomainService.RegisterServiceInstance
    }

}

module.exports = MyServicesManager