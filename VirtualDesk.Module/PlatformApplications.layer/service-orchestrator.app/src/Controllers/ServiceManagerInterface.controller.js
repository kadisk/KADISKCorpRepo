const ServiceManagerInterfaceController = (params) => {

    const {
        servicesOrchestratorService
    } = params

    const {
        ListServices,
        ListServicesByRepositoryIds,
        GetService,
        GetNetworksSettings,
        ListImageBuildHistory,
        ListInstances,
        ListContainers,
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
    } = servicesOrchestratorService

    const ServicesStatusChange = async (websocket) => {
        servicesOrchestratorService
            .onChangeServiceStatus(({ serviceId, status }) => {
                websocket.send(JSON.stringify({ serviceId, status }))
            })
    }

    const InstanceListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeInstanceListData(serviceId, (instanceList) => {
                websocket.send(JSON.stringify(instanceList))
            })
    }

    const ContainerListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeContainerListData(serviceId, (containerList) => {
                websocket.send(JSON.stringify(containerList))
            })
    }

    const ImageBuildHistoryListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeImageBuildHistoryListData(serviceId, (imageBuildHistoryList) => {
                websocket.send(JSON.stringify(imageBuildHistoryList))
            })
    }

    const controllerServiceObject = {
        controllerName: "ServiceManagerInterfaceController",
        ListServices,
        ListServicesByRepositoryIds,
        GetService,
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

module.exports = ServiceManagerInterfaceController