const MyServicesManagerController = (params) => {

    const {
        myServiceManagerSocketPath,
        myServiceManagerUrl,
        commandExecutorLib
    } = params
    
    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    const ServiceManagerCommand = async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .ServiceOrchestratorAppInstance
            .ServiceManagerInterface
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: myServiceManagerUrl,
            mainApplicationSocketPath: myServiceManagerSocketPath,
            CommandFunction: APICommandFunction
        })
    }

    const ServiceManagerSocketBridgeCommand = (websocket, GetSocket) => {
        ServiceManagerCommand((API) => {
            const socket =  GetSocket(API)
            socket.onmessage = (event) => {
                const {data} = event
                websocket.send(data)
            }
        })
    }

    const ListProvisionedServices        = ( { authenticationData:{ userId } } ) => ServiceManagerCommand((API) => API.ListProvisionedServices({ userId }))
    const GetServiceData                 = ( serviceId )                         => ServiceManagerCommand((API) => API.GetServiceData({ serviceId }))
    const ListImageBuildHistory          = ( serviceId )                         => ServiceManagerCommand((API) => API.ListImageBuildHistory({ serviceId }))
    const ListInstances                  = ( serviceId )                         => ServiceManagerCommand((API) => API.ListInstances({ serviceId }))
    const ListContainers                 = ( serviceId )                         => ServiceManagerCommand((API) => API.ListContainers({ serviceId }))
    const StartService                   = ( serviceId )                         => ServiceManagerCommand((API) => API.StartService({ serviceId }))
    const StopService                    = ( serviceId )                         => ServiceManagerCommand((API) => API.StopService({ serviceId }))
    const GetServiceStatus               = ( serviceId )                         => ServiceManagerCommand((API) => API.GetServiceStatus({ serviceId }))
    const GetNetworksSettings            = ( serviceId )                         => ServiceManagerCommand((API) => API.GetNetworksSettings({ serviceId }))
    const GetInstanceStartupParamsData   = ( serviceId )                         => ServiceManagerCommand((API) => API.GetInstanceStartupParamsData({ serviceId }))
    const GetInstanceStartupParamsSchema = ( serviceId )                         => ServiceManagerCommand((API) => API.GetInstanceStartupParamsSchema({ serviceId }))
    const GetInstancePortsData           = ( serviceId )                         => ServiceManagerCommand((API) => API.GetInstancePortsData({ serviceId }))
    const GetNetworkModeData             = ( serviceId )                         => ServiceManagerCommand((API) => API.GetNetworkModeData(serviceId))
    const UpdateServicePorts             = ({ serviceId, ports })                => ServiceManagerCommand((API) => API.UpdateServicePorts({ serviceId, ports }))
    const UpdateServiceStartupParams     = ({ serviceId, startupParams })        => ServiceManagerCommand((API) => API.UpdateServiceStartupParams({ serviceId, startupParams }))

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
        
        await ServiceManagerCommand((API) => 
            API.ProvisionService({
                username,
                packageId,
                serviceName,
                serviceDescription,
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