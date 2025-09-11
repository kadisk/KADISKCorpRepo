const MyServicesManagerController = (params) => {

    const {
        repositoryStorageManagerService,
        serviceOrchestratorSocketPath,
        serviceOrchestratorServerManagerUrl,
        commandExecutorLib
    } = params
    
    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    const ServiceOrchestratorCommand = async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .ServiceOrchestratorAppInstance
            .ServiceManagerInterface
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: serviceOrchestratorServerManagerUrl,
            mainApplicationSocketPath: serviceOrchestratorSocketPath,
            CommandFunction: APICommandFunction
        })
    }

    const ServiceManagerSocketBridgeCommand = (websocket, GetSocket) => {
        ServiceOrchestratorCommand((API) => {
            const socket =  GetSocket(API)
            socket.onmessage = (event) => {
                const {data} = event
                websocket.send(data)
            }
        })
    }

    const ListProvisionedServices = ( { authenticationData:{ userId } } ) => {
        return ServiceOrchestratorCommand(async (API) => {
            const repositories = await repositoryStorageManagerService.ListRepositoriesByUserId(userId)
            const repositoryIds = repositories.map(({id}) => id)
            return API.ListServicesByRepositoryIds({ repositoryIds })
        })
    }

    const GetServiceData = ( serviceId ) => {
        return ServiceOrchestratorCommand(async (API) => {
            const packageData = await repositoryStorageManagerService.GetPackageById(originPackageId)
            const serviceInfo = await API.GetService({ serviceId })
            return {
                ...serviceInfo,
                packageId           : packageData.packageId,
                packageName         : packageData.packageName,
                packageType         : packageData.packageType,
                repositoryNamespace : packageData.repositoryNamespace,
                repositoryId        : packageData.repositoryId
            }
        })
    }

    const ListImageBuildHistory          = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.ListImageBuildHistory({ serviceId }))
    const ListInstances                  = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.ListInstances({ serviceId }))
    const ListContainers                 = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.ListContainers({ serviceId }))
    const StartService                   = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.StartService({ serviceId }))
    const StopService                    = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.StopService({ serviceId }))
    const GetServiceStatus               = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.GetServiceStatus({ serviceId }))
    const GetNetworksSettings            = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.GetNetworksSettings({ serviceId }))
    const GetInstanceStartupParamsData   = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.GetInstanceStartupParamsData({ serviceId }))
    const GetInstanceStartupParamsSchema = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.GetInstanceStartupParamsSchema({ serviceId }))
    const GetInstancePortsData           = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.GetInstancePortsData({ serviceId }))
    const GetNetworkModeData             = ( serviceId )                         => ServiceOrchestratorCommand((API) => API.GetNetworkModeData(serviceId))
    const UpdateServicePorts             = ({ serviceId, ports })                => ServiceOrchestratorCommand((API) => API.UpdateServicePorts({ serviceId, ports }))
    const UpdateServiceStartupParams     = ({ serviceId, startupParams })        => ServiceOrchestratorCommand((API) => API.UpdateServiceStartupParams({ serviceId, startupParams }))

    const ServicesStatusChange        = (websocket)            => ServiceManagerSocketBridgeCommand(websocket, (API) => API.ServicesStatusChange())
    const InstanceListChange          = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.InstanceListChange({serviceId}))
    const ContainerListChange         = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.ContainerListChange({serviceId}))
    const ImageBuildHistoryListChange = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.ImageBuildHistoryListChange({serviceId}))

    const ProvisionService = async ({
        packageId,
        serviceName,
        serviceDescription,
        startupParams,
        ports,
        networkmode
    }, { authenticationData }) => {
         const { userId, username } = authenticationData

        const packageData = await repositoryStorageManagerService.GetPackageById(packageId)
        const { 
            repositoryId,
            repositoryNamespace,
            repositoryCodePath,
            packageName,
            packageType,
            packagePath
        } = packageData

        
        
        await ServiceOrchestratorCommand((API) => 
            API.ProvisionService({
                username,
                serviceName,
                serviceDescription,
                originRepositoryId: repositoryId,
                originRepositoryNamespace: repositoryNamespace,
                originRepositoryCodePath: repositoryCodePath,
                originPackageId: packageId,
                originPackageName: packageName,
                originPackageType: packageType,
                originPackagePath: packagePath,
                startupParams, 
                ports,
                networkmode
            }))
    }

    const controllerServiceObject = {
        controllerName: "MyServicesManagerController",
        ListProvisionedServices,
        GetServiceData,
        GetNetworksSettings,
        ListImageBuildHistory,
        ListInstances,
        ListContainers,
        ServicesStatusChange,
        InstanceListChange,
        ContainerListChange,
        ImageBuildHistoryListChange,
        GetServiceStatus,
        StartService,
        StopService,
        GetInstanceStartupParamsData,
        GetInstanceStartupParamsSchema,
        GetInstancePortsData,
        GetNetworkModeData,
        UpdateServicePorts,
        UpdateServiceStartupParams,
        ProvisionService
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyServicesManagerController