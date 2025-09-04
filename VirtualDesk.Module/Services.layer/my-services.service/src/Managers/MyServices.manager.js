const { join, resolve} = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeMyServicesPersistentStoreManager = require("../Helpers/InitializeMyServicesPersistentStoreManager")

const CreateMyWorkspaceDomainService             = require("../Helpers/CreateMyWorkspaceDomainService")
const CreateServiceRuntimeStateManager           = require("../Helpers/CreateServiceRuntimeStateManager")

const RequestTypes = require("../Helpers/Request.types")

const CreateServiceHandler = require("../Helpers/CreateServiceHandler")

const MyServicesManager = (params) => {

    const {
        onReady,
        serviceStorageFilePath,
        instanceDataDirPath,
        containerManagerService,
        repositoryStorageManagerService
    } = params


    const absolutServiceStorageFilePath                = ConvertPathToAbsolutPath(serviceStorageFilePath)
    const absolutInstanceDataDirPath                   = ConvertPathToAbsolutPath(instanceDataDirPath)

    const MyServicesPersistentStoreManager = InitializeMyServicesPersistentStoreManager(absolutServiceStorageFilePath)

    const {
        Service             : ServiceModel,
        ImageBuildHistory   : ImageBuildHistoryModel,
        Instance            : InstanceModel,
        Container           : ContainerModel,
        ContainerEventLog   : ContainerEventLogModel
    } = MyServicesPersistentStoreManager.models

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
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
        repositoryStorageManagerService,
        MyWorkspaceDomainService,
        BuildImageFromDockerfileString,
        CreateNewContainer
    })

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
                    const serviceData = await GetServiceData(data.serviceId)
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
                        originPackageId    : data.originPackageId,
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
        const serviceIds = await MyWorkspaceDomainService.ListAllServiceId()
        serviceIds.forEach(serviceId => LoadServiceInStateManagement(serviceId))
    }
    

    const _BuildImage = async ({
        serviceName,
        serviceId,
        instanceId,
        originPackageId,
        repositoryCodePath,
        startupParams
    }) => {

        const packageData = await repositoryStorageManagerService.GetPackageById(originPackageId)

        const imageTagName = `ecosystem_${packageData.repositoryNamespace}_${packageData.packageName}-${packageData.packageType}:${serviceName}-${serviceId}`.toLowerCase()

        const buildData = await BuildImage({
                imageTagName,
                repositoryCodePath,
                repositoryNamespace: packageData.repositoryNamespace,
                packagePath: packageData.packagePath,
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

        const repositories = await repositoryStorageManagerService.ListRepositoriesByUserId(userId)
        const repositoryIds = repositories.map(({id}) => id)

        const servicesData = await MyWorkspaceDomainService.ListServicesByRepositoryIds(repositoryIds)

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
            originPackageId,
            instanceRepositoryCodePath
        } = serviceData
        
        const packageData = await repositoryStorageManagerService.GetPackageById(originPackageId)

        return {
            serviceId,
            serviceName,
            serviceDescription,
            appType,
            packageId: packageData.packageId,
            packageName: packageData.packageName,
            packageType: packageData.packageType,
            repositoryNamespace: packageData.repositoryNamespace,
            repositoryId: packageData.repositoryId,
            instanceRepositoryCodePath
        }

    }

    const GetInstanceStartupParamsData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData?.startupParams || {}
    }

    const GetInstanceStartupParamsSchema = async (serviceId) => {
        const serviceData = await MyWorkspaceDomainService.GetServiceById(serviceId)
        const metadata = await GetMetadataByPackageId(serviceData.originPackageId)
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

    _Start()

    return {
        ProvisionService,
        ListProvisionedServices,
        GetServiceData,
        ListInstances,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeImageBuildHistoryListData,
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
        UpdateServiceStartupParams
    }

}

module.exports = MyServicesManager