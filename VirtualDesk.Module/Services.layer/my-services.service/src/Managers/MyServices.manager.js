const { join, resolve} = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeMyServicesPersistentStoreManager = require("../Helpers/InitializeMyServicesPersistentStoreManager")
const InitializeRepositoryPersistentStoreManager = require("../Helpers/InitializeRepositoryPersistentStoreManager")
const PrepareDirPath                             = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                          = require("../Helpers/CreateItemIndexer")
const CreateMyWorkspaceDomainService             = require("../Helpers/CreateMyWorkspaceDomainService")
const CreateRepositoryStorageDomainService       = require("../Helpers/CreateRepositoryStorageDomainService")
const CreateServiceRuntimeStateManager           = require("../Helpers/CreateServiceRuntimeStateManager")

const RequestTypes                     = require("../Helpers/Request.types")


const CreateServiceHandler = require("../Helpers/CreateServiceHandler")

const MyServicesManager = (params) => {

    const {
        onReady,
        serviceStorageFilePath,
        repositoryStorageFilePath,
        importedRepositoriesSourceCodeDirPath,
        instanceDataDirPath,
        ecosystemDefaultsFileRelativePath,
        ecosystemdataHandlerService,
        containerManagerService,
        extractTarGzLib,
        loadMetatadaDirLib,
        jsonFileUtilitiesLib
    } = params

    const ExtractTarGz    = extractTarGzLib.require("ExtractTarGz")
    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")
    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const absolutServiceStorageFilePath                = ConvertPathToAbsolutPath(serviceStorageFilePath)
    const absolutRepositoryStorageFilePath             = ConvertPathToAbsolutPath(repositoryStorageFilePath)
    const absolutImportedRepositoriesSourceCodeDirPath = ConvertPathToAbsolutPath(importedRepositoriesSourceCodeDirPath)
    const absolutInstanceDataDirPath                   = ConvertPathToAbsolutPath(instanceDataDirPath)

    const MyServicesPersistentStoreManager = InitializeMyServicesPersistentStoreManager(absolutServiceStorageFilePath)
    const RepositoryPersistentStoreManager = InitializeRepositoryPersistentStoreManager(absolutRepositoryStorageFilePath)

    const {
        RepositoryNamespace : RepositoryNamespaceModel,
        RepositoryImported  : RepositoryImportedModel,
        RepositoryItem      : RepositoryItemModel
    } = RepositoryPersistentStoreManager.models

    const {
        Service             : ServiceModel,
        ImageBuildHistory   : ImageBuildHistoryModel,
        Instance            : InstanceModel,
        Container           : ContainerModel,
        ContainerEventLog   : ContainerEventLogModel
    } = MyServicesPersistentStoreManager.models

    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const RepositoryStorageDomainService = CreateRepositoryStorageDomainService({
        RepositoryNamespaceModel,
        RepositoryImportedModel,
        RepositoryItemModel
    })

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
        RepositoryNamespaceModel,
        RepositoryImportedModel, 
        RepositoryItemModel, 
        ServiceModel,
        ImageBuildHistoryModel,
        InstanceModel,
        ContainerModel,
        ContainerEventLogModel
    })

    const { 
        BuildImageFromDockerfileString,
        CreateNewContainer,
        RemoveContainer,
        InspectContainer,
        RegisterDockerEventListener,
        StartContainer,
        StopContainer
    } = containerManagerService

    
    const ServiceRuntimeStateManager = CreateServiceRuntimeStateManager()

    const {
        LoadServiceInStateManagement,
        CreateServiceInStateManagement,
        SwapRunningInstance,
        GetServiceStatus,
        GetNetworksSettings,
        onChangeServiceStatus,
        onRequestData,
        NotifyContainerActivity,
        StartService,
        StopService,
        ListInstances,
        ListRunningInstances,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeImageBuildHistoryListData
    } = ServiceRuntimeStateManager


    const {
        CreateService,
        BuildImage,
        CreateContainer,
        CreateInstance
    } = CreateServiceHandler({
        absolutInstanceDataDirPath,
        MyWorkspaceDomainService,
        BuildImageFromDockerfileString,
        CreateNewContainer
    })

    const _MountPathImportedRepositoriesSourceCodeDirPath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutImportedRepositoriesSourceCodeDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const _Start = async () => {

        await MyServicesPersistentStoreManager.ConnectAndSync()
        RegisterDockerEventListener((eventData) => {

            const { Type, Action, Actor } = eventData

            switch(Type){
                case "container":
                    const { ID, Attributes } = Actor
                    NotifyContainerActivity({ ID, Action, Attributes })
                    break
                case "network":
                    switch(Action){
                        case "connect":
                            break
                        case "disconnect":
                            break
                        default:
                            //console.log(eventData) 
                    }
                    break
                case "images":
                    switch(Action){
                        case "create":
                            break
                        case "tag":
                            break
                        default:
                            //console.log(eventData) 
                    }

                
                default:
                    //console.log(eventData) 
            }
                    


        })

        onRequestData(async (requestType, data) => {
            
            switch (requestType) {
                case RequestTypes.INSTANCE_DATA_LIST:
                    return await MyWorkspaceDomainService.ListActiveInstancesByServiceId(data.serviceId)
                case RequestTypes.IMAGE_BUILD_DATA_LIST:
                    return await MyWorkspaceDomainService.ListImageBuildHistoryByServiceId(data.serviceId)
                case RequestTypes.CONTAINER_DATA:
                    return await await MyWorkspaceDomainService.GetContainerInfoByInstanceId(data.instanceId)
                case RequestTypes.CONTAINER_INSPECTION_DATA:
                    return await InspectContainer(data.containerName)
                case RequestTypes.START_CONTAINER:
                    await StartContainer(data.containerHashId)
                    break
                case RequestTypes.STOP_CONTAINER:
                    await StopContainer(data.containerHashId)
                    break
                case RequestTypes.REMOVE_CONTAINER:
                    await RemoveContainer(data.containerHashId)
                    break
                case RequestTypes.SERVICE_DATA:
                    const serviceData = await MyWorkspaceDomainService.GetServiceById(data.serviceId)
                    return serviceData
                case RequestTypes.CREATE_NEW_INSTANCE:
                    const instanceData = await CreateInstance({
                        serviceId     : data.serviceId,
                        startupParams : data.startupParams,
                        networkmode   : data.networkmode,
                        ports         : data.ports
                    })
                    return instanceData
                case RequestTypes.BUILD_NEW_IMAGE:
                    const buildData = await _BuildImage({
                        serviceName        : data.serviceName,
                        serviceId          : data.serviceId,
                        instanceId         : data.instanceId,
                        packageId          : data.packageId,
                        repositoryCodePath : data.repositoryCodePath,
                        startupParams      : data.startupParams
                    })
                    return buildData
                case RequestTypes.CREATE_NEW_CONTAINER:
                    const containerData = await _CreateContainer({
                        instanceId  : data.instanceId,
                        buildId     : data.buildId,
                        tag         : data.tag,
                        serviceName : data.serviceName,
                        networkmode : data.networkmode,
                        ports       : data.ports
                    })

                    return containerData
                default:
                    console.warn(`Unknown request type: ${requestType.description}`)
            }
        })

        await InitializeAllServiceStateManagement()
        onReady()

    }

    const InitializeAllServiceStateManagement = async  () => {
        const serviceIds = await MyWorkspaceDomainService.ListServiceIds()
        serviceIds.forEach(serviceId => LoadServiceInStateManagement(serviceId))
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

    const CreateNamespace = async ({ userId, repositoryNamespace }) => {
        const existingNamespaceId = await RepositoryStorageDomainService.GetRepositoryNamespaceId(repositoryNamespace)

        if (existingNamespaceId !== undefined) 
            throw new Error('Repository Namespace already exists')

        const newNamespaceData = await MyWorkspaceDomainService
            .RegisterRepositoryNamespace({ namespace: repositoryNamespace , userId })
            
        return newNamespaceData
    }

    const CreateRepository = async ({ namespaceId, repositoryCodePath, sourceType, sourceParams }) => {

        const newRepositoryImported = await MyWorkspaceDomainService
            .RegisterRepositoryImported({ 
                namespaceId,
                repositoryCodePath, 
                sourceType, 
                sourceParams
            })
            
        return newRepositoryImported
    }

    const GetStatus = async (userId) => {
        const repositoryCount = await RepositoryNamespaceModel.count({ where: { userId } })
    
        if (repositoryCount > 0) {
            return "READY"
        } else {
            return "NO_REPOSITORIES"
        }
    }
    
    const GetMetadataByPackageId = async (packageId) => { 
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const packageData = await RepositoryStorageDomainService.GetItemById(packageId)

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
        const packageItems  = await RepositoryStorageDomainService.ListLatestPackageItemsByUserId(userId)
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

    const ListRepositoryNamespace = async (userId) => {
        const repositoriesData  = await RepositoryStorageDomainService.ListRepositoryNamespace(userId)
        
        const repositories = repositoriesData
            .map((repositoryData) => {
                const { id, namespace } = repositoryData
                return { id, namespace } 
            })

        return repositories
    }

    const _BuildImage = async ({
        serviceName,
        serviceId,
        instanceId,
        packageId,
        repositoryCodePath,
        startupParams
    }) => {

        const packageData = await RepositoryStorageDomainService.GetPackageById(packageId)

        const imageTagName = `ecosystem_${packageData.repositoryNamespace}_${packageData.itemName}-${packageData.itemType}:${serviceName}-${serviceId}`.toLowerCase()

        const buildData = await BuildImage({
                imageTagName,
                repositoryCodePath,
                repositoryNamespace: packageData.repositoryNamespace,
                packagePath: packageData.itemPath,
                instanceId,
                startupParams
            })


        return buildData
    }

    const _CreateContainer = async ({
        buildId,
        tag,
        instanceId,
        serviceName,
        networkmode,
        ports,
    }) => {

        const containerName = `container_${serviceName}-${buildId}`

        const containerData = await CreateContainer({
                containerName,
                instanceId,
                buildId,
                imageName: tag,
                ports,
                networkmode
            })

        return containerData
        
    }

    const ProvisionService = async ({
        username,
        packageId,
        serviceName,
        serviceDescription,
        startupParams,
        ports = [],
        networkmode= "bridge"
    }) => {

        const serviceData = await CreateService({
                username,
                packageId,
                serviceName,
                serviceDescription
            })

        CreateServiceInStateManagement(serviceData.id, {
            startupParams,
            ports,
            networkmode
        })
    }

    const ListProvisionedServices = async (userId) => {

        const servicesData = await MyWorkspaceDomainService.ListServicesByUserId(userId)

        const provisionedServicesData = servicesData
            .map((provisionedService) => {

                const { 
                    id: serviceId,
                    serviceName,
                    packageId,
                    packageName,
                    packageType,
                    repositoryId,
                    repositoryNamespace
                } = provisionedService


                return {
                    status : GetServiceStatus(serviceId),
                    serviceId,
                    serviceName,
                    packageId,
                    repositoryId,
                    repositoryNamespace,
                    packageName,
                    packageType
                }
                
            })

        return provisionedServicesData
    }


    const GetServiceData = async (serviceId) => {
            
        const serviceData = await MyWorkspaceDomainService.GetServiceById(serviceId)
        
        const {
            serviceName,
            serviceDescription,
            appType,
            packageId,
            packageName,
            packageType,
            repositoryNamespace,
            repositoryId
        } = serviceData

        return {
            serviceId,
            serviceName,
            serviceDescription,
            appType,
            repositoryId,
            repositoryNamespace,
            packageId,
            packageName,
            packageType,
        }

    }

    const GetInstanceStartupParamsData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData?.startupParams || {}
    }

    const GetInstanceStartupParamsSchema = async (serviceId) => {
        const serviceData = await MyWorkspaceDomainService.GetServiceById(serviceId)
        const metadata = await GetMetadataByPackageId(serviceData.packageId)
        return metadata?.schema || {}
    }

    const GetInstancePortsData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData.ports || []
    }

    const GetNetworkModeData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        if(instanceData?.networkmode)
            return instanceData.networkmode
    }

    const _GetFirstRunningInstance = (serviceId) => {
        const runningInstances = ListRunningInstances(serviceId)
        const [ firstInstanceRunning ] = runningInstances
        return firstInstanceRunning
    }

    const UpdateServicePorts = async ({ serviceId, ports }) => {
        const firstInstanceRunning = _GetFirstRunningInstance(serviceId)
        SwapRunningInstance(serviceId, {
            ports,
            startupParams: firstInstanceRunning.startupParams,
            networkmode: firstInstanceRunning.networkmode
        })
    }

    const UpdateServiceStartupParams = async ({ serviceId, startupParams }) => {
        const firstInstanceRunning = _GetFirstRunningInstance(serviceId)
        SwapRunningInstance(serviceId, {
            ports: firstInstanceRunning.ports,
            startupParams,
            networkmode: firstInstanceRunning.networkmode
        })
    }

    const ListRepositories = async (namespaceId) => {
        const repositories = await RepositoryStorageDomainService.ListRepositories(namespaceId)
        return repositories.map(({ id, createdAt, sourceType, sourceParams }) => ({
            id,
            createdAt,
            sourceType,
            sourceParams
        }))
    }

    _Start()

    return {
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        ExtractAndRegisterRepository,
        RegisterNamespaceAndRepositoryCloned,
        RegisterImportedRepository,
        GetStatus,
        ListBootablePackages,
        ListRepositoryNamespace,
        ProvisionService,
        ListProvisionedServices,
        GetServiceData,
        ListRepositories,
        ListInstances,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeImageBuildHistoryListData,
        GetMetadataByPackageId,
        GetServiceStatus,
        GetNetworksSettings,
        onChangeServiceStatus,
        StartService,
        StopService,
        GetInstanceStartupParamsData,
        GetInstanceStartupParamsSchema,
        GetInstancePortsData,
        GetNetworkModeData,
        UpdateServicePorts,
        UpdateServiceStartupParams,
        GetNamespace: RepositoryStorageDomainService.GetNamespace
    }

}

module.exports = MyServicesManager