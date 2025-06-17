const { join, resolve} = require("path")
const os = require('os')
const EventEmitter = require("events")

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
const CreateMyWorkspaceDomainService   = require("../Helpers/CreateMyWorkspaceDomainService")
const GetContextTarStream              = require("../Helpers/GetContextTarStream")
const CopyDirRepository                = require("../Helpers/CopyDirRepository")


const LifecycleStatusOptions = Object.freeze({
    LOADING    : Symbol("LOADING"),
    STARTING   : Symbol("STARTING"),
    STOPPING   : Symbol("STOPPING"),
    RUNNING    : Symbol("RUNNING"),
    FAILURE    : Symbol("FAILURE"),
    TERMINATED : Symbol("TERMINATED")
}) 

const INITIAL_STATE = {
    status: undefined,
    data: {},
    error: undefined
}

const CreateServiceRuntimeStateManager = () => {

    const { LOADING } = LifecycleStatusOptions

    const state = {}

    const eventEmitter = new EventEmitter()

    const STATUS_CHANGE_EVENT = Symbol()
    const REQUEST_INSTANCE_DATA_EVENT = Symbol()
    const RECEIVE_INSTANCE_DATA_EVENT = Symbol()

    const _CreateInitialState = () => ({...INITIAL_STATE})

    const _ValidateServiceDoesNotExist = (serviceId) => {
        if (state[serviceId]) {
            throw new Error(`Service with ID ${serviceId} already exists`)
        }
    }

    const _ValidateServiceExist = (serviceId) => {
        if (!state[serviceId]) {
            throw new Error(`Service with ID ${serviceId} does not exist`)
        }
    }

    const _RequestInstanceData = (serviceId) => eventEmitter.emit(REQUEST_INSTANCE_DATA_EVENT, { serviceId })

    const _ProcessServiceStatusChange = (serviceId) => {
        switch (state[serviceId].status) {
            case LifecycleStatusOptions.LOADING:
                _RequestInstanceData(serviceId)
                break
            case LifecycleStatusOptions.STARTING:
                console.log(`Service ${serviceId} is starting`)
                break          
            case LifecycleStatusOptions.STOPPING:
                console.log(`Service ${serviceId} is stopping`)
                break
            case LifecycleStatusOptions.RUNNING:
                console.log(`Service ${serviceId} is running`)
                break
            case LifecycleStatusOptions.FAILURE:
                console.error(`Service ${serviceId} has failed`)
                break
            case LifecycleStatusOptions.TERMINATED:
                console.log(`Service ${serviceId} has been terminated`)
                break
            default:
                console.warn(`Service ${serviceId} has an unknown status: ${state[serviceId].status}`)
        }

    }

    eventEmitter.on(STATUS_CHANGE_EVENT, ({ serviceId }) => _ProcessServiceStatusChange(serviceId))

    const AddServiceInStateManagement = (serviceId) => {
        _ValidateServiceDoesNotExist()
        state[serviceId] = _CreateInitialState()
        ChangeServiceStatus(serviceId, LOADING)
    }

    const _GetServiceState = (serviceId) => {
        _ValidateServiceExist(serviceId)    
        const state = state[serviceId]
        return state
    }

    const GetServiceStatus = (serviceId) => {
        const status = _GetServiceState(serviceId).status
        return status.toString()
    }

    const ChangeServiceStatus = (serviceId, newStatus) => {
        _ValidateServiceExist(serviceId)
        state[serviceId].status = newStatus
        eventEmitter.emit(STATUS_CHANGE_EVENT, { serviceId })
    }

    const SubscribeListenerRuntimeRequestInstanceData = (onRequestData) => {
        eventEmitter.on(REQUEST_INSTANCE_DATA_EVENT, ({ serviceId }) => {
            const instanceData = onRequestData(serviceId) 
            console.log(instanceData)

        })

        
    }

    return {
        AddServiceInStateManagement,
        GetServiceStatus,
        ChangeServiceStatus,
        SubscribeListenerRuntimeRequestInstanceData
    }
}

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
        Instance          : InstanceModel
    } = PersistentStoreManager.models

    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
        RepositoryModel, 
        RepositoryItemModel, 
        ServiceModel,
        ImageBuildHistoryModel,
        InstanceModel
    })

    const { 
        BuildImageFromDockerfileString,
        CreateNewContainer,
        InspectContainer,
        RegisterDockerEventListener
    } = containerManagerService

    const ServiceRuntimeStateManager = CreateServiceRuntimeStateManager()

    const {
        AddServiceInStateManagement,
        GetServiceStatus,
        ChangeServiceStatus,
        SubscribeListenerRuntimeRequestInstanceData,
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
            console.log(eventData) 
        })
        
        SubscribeListenerRuntimeRequestInstanceData((serviceId) => {
            console.log(serviceId)
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
        const repositoriesCodePath = _MountPathImportedRepositoriesSourceCodeDirPath({username, repositoryNamespace})

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

    const BuildImage = async ({
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

    const CreateAndStartContainer = async ({
        containerName,
        imageName,
        ports = []
    }) => {

        const _RemapPort = (ports) => ports.map(({ servicePort, hostPort }) => ({ containerPort:servicePort, hostPort }))

        const container = await CreateNewContainer({
            imageName,
            containerName,
            ports: _RemapPort(ports)
        })

        await container.start()
        console.log(`[INFO] Container '${containerName}' iniciado com a imagem '${imageName}'`)

    }

    const CreateInstance = async({
        username,
        serviceData,
        packageData,
        startupParams,
        ports
    }) => {

        //é preciso atualizar as instances para que era tenha um registro de mudança de status
        //o ImageBuildHistory precisa estar associado a instancia
        //criar ContainerStatusHistory

        const instanceData = await MyWorkspaceDomainService
            .RegisterInstance({
                serviceId: serviceData.id,
                startupParams
            })

        const imageTagName = `ecosystem_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}:${serviceData.serviceName}-${serviceData.id}`.toLowerCase()

        const buildData = await BuildImage({
            imageTagName,
            repositoryCodePath: serviceData.instanceRepositoryCodePath,
            repositoryNamespace: packageData.repositoryNamespace,
            packagePath: packageData.itemPath,
            instanceData
        })

        const containerName = `container_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}--${serviceData.serviceName}--${buildData.id}`
        const imageName = buildData.tag

        await CreateAndStartContainer({ containerName, imageName, ports })

    }

    const ProvisionService = async ({
        userId, 
        username,
        packageId,
        serviceName,
        serviceDescription,
        startupParams,
        ports = []
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

        
        await CreateInstance({
            username,
            serviceData,
            packageData,
            startupParams,
            ports
        })

        AddServiceInStateManagement(serviceData.id)
        
    }

    const ListProvisionedServices = async (userId) => {

        const servicesData = await MyWorkspaceDomainService.ListServices(userId)

        const provisionedServicesData = servicesData
            .map((provisionedService) => {

                const { 
                    id,
                    serviceName,
                    packageId,
                    RepositoryItem,
                    Repository
                } = provisionedService

                return {
                    status : "running", // TODO: Implement status check
                    serviceId           : id,
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
            appType             : serviceData.appType,
            repositoryId        : Repository.id,
            repositoryNamespace : Repository.namespace,
            packageId           : RepositoryItem.id,
            packageName         : RepositoryItem.itemName,
            packageType         : RepositoryItem.itemType,
        }

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
        GetMetadataByPackageId
    }

}

module.exports = MyServicesManager