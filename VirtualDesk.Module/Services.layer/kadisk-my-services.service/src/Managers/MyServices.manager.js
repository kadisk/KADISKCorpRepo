const { join, resolve} = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
const CreateMyWorkspaceDomainService   = require("../Helpers/CreateMyWorkspaceDomainService")
const GetContextTarStream              = require("../Helpers/GetContextTarStream")
const CopyDirRepository                = require("../Helpers/CopyDirRepository")
const CreateServiceRuntimeStateManager = require("../Helpers/CreateServiceRuntimeStateManager")

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
        onRequestInstanceData,
        onRequestContainerData,
        onRequestContainerInspectionData,
        onRequestStartContainer,
        onRequestStopContainer,
        NotifyContainerActivity,
        StartService,
        StopService,
        UpdatePorts
    } = ServiceRuntimeStateManager

    const _MountPathImportedRepositoriesSourceCodeDirPath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutImportedRepositoriesSourceCodeDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const _MountPathInstanceRepositoriesSourceCodeDirPath = ({username, repositoryNamespace, serviceDataDirName}) => {
        const repositoriesCodePath = resolve(absolutInstanceDataDirPath, username, serviceDataDirName, repositoryNamespace)
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
        
        onRequestInstanceData(async (serviceId) => {
            const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
            return instanceData
        })

        onRequestContainerData(async (instanceId) => {
            const containerData = await MyWorkspaceDomainService.GetContainerInfoByInstanceId(instanceId)
            return containerData
        })

        onRequestContainerInspectionData(async (containerName) => {
            const inspectData = await InspectContainer(containerName)
            return inspectData
        })

        onRequestStartContainer((containerHashId) => {
            StartContainer(containerHashId)
        })

        onRequestStopContainer((containerHashId) => {
            StopContainer(containerHashId)
        })

        await InitializeAllServiceStateManagement()
        onReady()

    }

    const InitializeAllServiceStateManagement = async  () => {
        const servicesData = await MyWorkspaceDomainService.GetAllServices()
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

    const _BuildImage = async ({
        imageTagName,
        repositoryCodePath,
        repositoryNamespace,
        packagePath,
        instanceData
    }) => {
        
        const buildargs = {
            REPOSITORY_NAMESPACE: repositoryNamespace
        }

        const packageAbsolutPath = join(repositoryCodePath, packagePath)

        const contextTarStream = GetContextTarStream({
            repositoryPathForCopy: repositoryCodePath,
            packagePathForCopy: packageAbsolutPath,
            startupParams: instanceData.startupParams
        })
        
        const _handleData = chunk => {
            try {
                const lines = chunk.toString().split('\n').filter(Boolean)
        
                for (const line of lines) {
                    const parsed = JSON.parse(line)
        
                    if (parsed.stream) {
                        console.log(parsed.stream)
                    } else if (parsed.status) {
                        console.log(`[STATUS] ${parsed.status}`)
                    } else if (parsed.error) {
                        console.log(parsed.error)
                    } else {
                        console.log(`[OTHER] ${line}`)
                    }
                }
        
            } catch (err) {
                console.error('Failed to parse Docker output chunk:', chunk.toString())
            }
        }
        
        const imageInfo = await BuildImageFromDockerfileString({
            buildargs,
            contextTarStream,
            imageTagName,
            onData: _handleData
        })

        const buildData = await MyWorkspaceDomainService
            .RegisterBuildedImage({
                instanceId: instanceData.id,
                tag: imageTagName,
                hashId: imageInfo.Id, 
            })


        return buildData
    }

    const _CreateAndStartContainer = async ({
        containerName,
        imageName,
        ports = [],
        networkmode
    }) => {

        const _RemapPort = (ports) => ports.map(({ servicePort, hostPort }) => ({ containerPort:servicePort, hostPort }))

        const container = await CreateNewContainer({
            imageName,
            containerName,
            ports: _RemapPort(ports),
            networkmode
        })

        await container.start()
        console.log(`[INFO] Container '${containerName}' iniciado com a imagem '${imageName}'`)

    }

    const _CreateContainer = async ({
        username,
        instanceData,
        packageData,
        serviceData,
        buildData,
        ports,
        networkmode
    }) => {

        const containerName = `container_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}--${serviceData.serviceName}--${buildData.id}`

        await MyWorkspaceDomainService
            .RegisterContainer({
                containerName,
                instanceId: instanceData.id,
                buildId: buildData.id
            })

        await _CreateAndStartContainer({ containerName, imageName: buildData.tag, ports, networkmode })
    }

    const _CreateInstance = async({
        username,
        serviceData,
        packageData,
        startupParams,
        ports,
        networkmode
    }) => {

        const instanceData = await MyWorkspaceDomainService
            .RegisterInstanceCreation({
                serviceId: serviceData.id,
                startupParams,
                ports,
                networkmode
            })

        const imageTagName = `ecosystem_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}:${serviceData.serviceName}-${serviceData.id}`.toLowerCase()

        const buildData = await _BuildImage({
            imageTagName,
            repositoryCodePath: serviceData.instanceRepositoryCodePath,
            repositoryNamespace: packageData.repositoryNamespace,
            packagePath: packageData.itemPath,
            instanceData
        })

        await _CreateContainer({
            username,
            instanceData,
            packageData,
            serviceData,
            buildData,
            ports,
            networkmode
        })

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

        const packageData = await MyWorkspaceDomainService.GetPackageItemById({ id: packageId, userId })
        const { repositoryCodePath } = packageData

        const instanceRepositoryCodePath = _MountPathInstanceRepositoriesSourceCodeDirPath({
            username, 
            repositoryNamespace: packageData.repositoryNamespace,
            serviceDataDirName:serviceName
        })

        const serviceData = await MyWorkspaceDomainService
            .RegisterServiceProvisioning({
                serviceName,
                serviceDescription,
                originRepositoryId: packageData.repositoryId,
                packageId: packageData.id,
                instanceRepositoryCodePath
        })

        await CopyDirRepository(repositoryCodePath, instanceRepositoryCodePath)

        await _CreateInstance({
            username,
            serviceData,
            packageData,
            startupParams,
            ports,
            networkmode
        })

        AddServiceInStateManagement(serviceData.id)

    }

    const ListProvisionedServices = async (userId) => {

        const servicesData = await MyWorkspaceDomainService.ListServices(userId)

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

    const UpdateServicePorts = async ({ serviceId, ports }) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)

        MyWorkspaceDomainService.
            RegisterTerminateInstance(instanceData.id)
        //UpdatePorts({ serviceId, ports })
        
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
        GetInstancesByServiceId: MyWorkspaceDomainService.GetInstancesByServiceId,
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