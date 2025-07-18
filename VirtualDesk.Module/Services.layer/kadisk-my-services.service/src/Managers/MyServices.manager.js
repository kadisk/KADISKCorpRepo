const { join, resolve} = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
const CreateMyWorkspaceDomainService   = require("../Helpers/CreateMyWorkspaceDomainService")
const CreateServiceRuntimeStateManager = require("../Helpers/CreateServiceRuntimeStateManager")

const RequestTypes                     = require("../Helpers/Request.types")


const CreateServiceHandler = require("../Helpers/CreateServiceHandler")

const MyServicesManager = (params) => {

    const {
        onReady,
        storageFilePath,
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

    const absolutStorageFilePath                       = ConvertPathToAbsolutPath(storageFilePath)
    const absolutImportedRepositoriesSourceCodeDirPath = ConvertPathToAbsolutPath(importedRepositoriesSourceCodeDirPath)
    const absolutInstanceDataDirPath                   = ConvertPathToAbsolutPath(instanceDataDirPath)

    const PersistentStoreManager = InitializePersistentStoreManager(absolutStorageFilePath)

    const {
        Repository        : RepositoryModel,
        RepositoryItem    : RepositoryItemModel,
        Service           : ServiceModel,
        ImageBuildHistory : ImageBuildHistoryModel,
        Instance          : InstanceModel,
        Container         : ContainerModel,
        ContainerEventLog : ContainerEventLogModel
    } = PersistentStoreManager.models

    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
        RepositoryModel, 
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
        InspectContainer,
        RegisterDockerEventListener,
        StartContainer,
        StopContainer
    } = containerManagerService

    const ServiceRuntimeStateManager = CreateServiceRuntimeStateManager()

    const {
        AddServiceInStateManagement,
        GetServiceStatus,
        GetNetworksSettings,
        onChangeServiceStatus,
        onRequestData,
        NotifyContainerActivity,
        StartService,
        StopService,
        NotifyInstanceSwap
    } = ServiceRuntimeStateManager


    const ServiceHandler = CreateServiceHandler({
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

        await PersistentStoreManager.ConnectAndSync()
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
                case RequestTypes.ACTIVE_INSTANCE_INFO_LIST:
                    const instanceDataList = await MyWorkspaceDomainService.ListActiveInstancesByServiceId(data.serviceId)
                    const instanceInfoList = instanceDataList.map(({ id:instanceId , startupParams, ports, networkmode }) => ({instanceId,  startupParams, ports, networkmode }) )
                    return instanceInfoList
                case RequestTypes.CONTAINER_DATA:
                    return await await MyWorkspaceDomainService.GetContainerInfoByInstanceId(data.instanceId)
                case RequestTypes.CONTAINER_INSPECTION_DATA:
                    return await InspectContainer(data.containerName)
                case RequestTypes.START_CONTAINER:
                    StartContainer(data.containerHashId)
                    break
                case RequestTypes.STOP_CONTAINER:
                    StopContainer(data.containerHashId)
                    break
                    
                default:
                    console.warn(`Unknown request type: ${requestType}`)
            }
        })

        await InitializeAllServiceStateManagement()
        onReady()

    }

    const InitializeAllServiceStateManagement = async  () => {
        const servicesData = await MyWorkspaceDomainService.ListServices()
        servicesData.forEach(serviceData => {
            AddServiceInStateManagement(serviceData.id)
        })
    }

    const SaveUploadedRepository = async ({ repositoryNamespace, userId, username , repositoryFilePath }) => {
        const repositoriesCodePath = _MountPathImportedRepositoriesSourceCodeDirPath({ username, repositoryNamespace })

        const newRepositoryCodePath = await ExtractTarGz(repositoryFilePath, repositoriesCodePath)
        const repoData = await RecordNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath })

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
        const repositoryCount = await RepositoryModel.count({ where: { userId } })
    
        if (repositoryCount > 0) {
            return "READY"
        } else {
            return "NO_REPOSITORIES"
        }
    }
    
    const GetMetadataByPackageId = async (packageId) => { 
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const packageData = await MyWorkspaceDomainService.GetItemById(packageId)

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
        const packageItems  = await MyWorkspaceDomainService.ListPackageItemByUserId(userId)
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

    const ListRepositories = async (userId) => {
        const repositoriesData  = await MyWorkspaceDomainService.ListRepositories(userId)
        
        const repositories = repositoriesData
            .map((repositoryData) => {
                const { id, namespace } = repositoryData
                return { id, namespace } 
            })

        return repositories
    }

    const ProvisionService = async ({
        userId, 
        username,
        packageId,
        serviceName,
        serviceDescription,
        startupParams,
        ports = [],
        networkmode= "bridge"
    }) => {

        const serviceData = await ServiceHandler
            .CreateService({
                userId, 
                username,
                packageId,
                serviceName,
                serviceDescription
            })
        
        /*const packageData = await MyWorkspaceDomainService.GetPackageItemById({ id: packageId, userId })

        const instanceData = await ServiceHandler
            .CreateInstance({
                serviceId: serviceData.id,
                startupParams,
                ports,
                networkmode
            })

        const imageTagName = `ecosystem_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}:${serviceData.serviceName}-${serviceData.id}`.toLowerCase()

        const buildData = await ServiceHandler
            .BuildImage({
                imageTagName,
                repositoryCodePath: serviceData.instanceRepositoryCodePath,
                repositoryNamespace: packageData.repositoryNamespace,
                packagePath: packageData.itemPath,
                instanceData
            })

        const containerName = `container_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}--${serviceData.serviceName}--${buildData.id}`

        await ServiceHandler
            .CreateContainer({
                containerName,
                instanceId: instanceData.id,
                buildData,
                ports,
                networkmode
            })*/

        AddServiceInStateManagement(serviceData.id)

    }

    const ListProvisionedServices = async (userId) => {

        const servicesData = await MyWorkspaceDomainService.ListServicesByUserId(userId)

        const provisionedServicesData = servicesData
            .map((provisionedService) => {

                const { 
                    id: serviceId,
                    serviceName,
                    packageId,
                    RepositoryItem,
                    Repository
                } = provisionedService

                return {
                    status              : GetServiceStatus(serviceId),
                    serviceId,
                    serviceName,
                    packageId,
                    repositoryId        : Repository.id,
                    repositoryNamespace : Repository.namespace,
                    packageId           : RepositoryItem.id,
                    packageName         : RepositoryItem.itemName,
                    packageType         : RepositoryItem.itemType
                }
                
            })

        return provisionedServicesData
    }


    const GetServiceData = async ({ serviceId, userId }) => {
            
        const serviceData = await MyWorkspaceDomainService.GetServiceById({serviceId, userId})
        
        const { 
            Repository, 
            RepositoryItem,
        } = serviceData

        return {
            serviceId           : serviceData.id,
            serviceName         : serviceData.serviceName,
            serviceDescription  : serviceData.serviceDescription,
            appType             : serviceData.appType,
            repositoryId        : Repository.id,
            repositoryNamespace : Repository.namespace,
            packageId           : RepositoryItem.id,
            packageName         : RepositoryItem.itemName,
            packageType         : RepositoryItem.itemType,
        }

    }

    const GetInstanceStartupParamsData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData.startupParams || {}
    }

    const GetInstancePortsData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData.ports || []
    }

    const GetNetworkModeData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData.networkmode
    }

    const UpdateServicePorts = async ({ serviceId, username, userId, ports }) => {

        const serviceData = await MyWorkspaceDomainService.GetServiceById({ serviceId, userId })
        const packageData = await MyWorkspaceDomainService.GetItemById(serviceData.packageId)
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)

        /*const nextInstance = await _CreateInstance({
            username,
            serviceData,
            packageData,
            startupParams: instanceData.startupParams,
            ports,
            networkmode: instanceData.networkmode
        })*/

        NotifyInstanceSwap({
            serviceId: serviceData.id,
            nextInstanceId: nextInstance.id,
        })
        
    }

    _Start()

    return {
        SaveUploadedRepository,
        GetStatus,
        ListBootablePackages,
        ListRepositories,
        ProvisionService,
        ListProvisionedServices,
        GetServiceData,
        ListImageBuildHistory: MyWorkspaceDomainService.ListImageBuildHistory,
        ListInstancesByServiceId: MyWorkspaceDomainService.ListInstancesByServiceId,
        GetMetadataByPackageId,
        GetServiceStatus,
        GetNetworksSettings,
        onChangeServiceStatus,
        StartService,
        StopService,
        GetInstanceStartupParamsData,
        GetInstancePortsData,
        GetNetworkModeData,
        UpdateServicePorts
    }

}

module.exports = MyServicesManager