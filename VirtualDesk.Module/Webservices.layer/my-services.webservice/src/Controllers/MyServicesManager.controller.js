const MyServicesManagerController = (params) => {

    const {
        myServicesManagerService
    } = params

    const ListProvisionedServices = ({ authenticationData }) => {
        const { userId } = authenticationData
        return myServicesManagerService.ListProvisionedServices(userId)
    }

    const GetServiceData = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetServiceData(serviceId)
    }

    const ListImageBuildHistory = (serviceId, { authenticationData }) => {
        return myServicesManagerService.ListImageBuildHistory(serviceId)
    }

    const ListInstances = (serviceId, { authenticationData }) => {
        return myServicesManagerService.ListInstances(serviceId)
    }

    const ListContainers = (serviceId, { authenticationData }) => {
        return myServicesManagerService.ListContainers(serviceId)
    }
    
    const ServicesStatusChange = async (websocket, { authenticationData }) => {
        myServicesManagerService
            .onChangeServiceStatus(({ serviceId, status }) => {
                websocket.send(JSON.stringify({ serviceId, status }))
            })
    }

    const StartService = ( serviceId ) => 
        myServicesManagerService.StartService(serviceId)

    const StopService  = ( serviceId ) =>
        myServicesManagerService.StopService(serviceId)

    const GetServiceStatus = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetServiceStatus(serviceId) 
    }

    const GetNetworksSettings = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetNetworksSettings(serviceId)
    }

    const GetInstanceStartupParamsData = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetInstanceStartupParamsData(serviceId)
    }

    const GetInstanceStartupParamsSchema = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetInstanceStartupParamsSchema(serviceId)
    }

    const GetInstancePortsData = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetInstancePortsData(serviceId)
    }

    const GetNetworkModeData = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetNetworkModeData(serviceId)
    }

    const UpdateServicePorts = async ({ serviceId, ports }, { authenticationData }) => {
        const { userId, username } = authenticationData 
        await myServicesManagerService.UpdateServicePorts({ serviceId, ports })
    }

    const UpdateServiceStartupParams = async ({ serviceId, startupParams }, { authenticationData }) => {
        const { userId, username } = authenticationData 
        await myServicesManagerService.UpdateServiceStartupParams({ serviceId, startupParams })
    }

    const InstanceListChange = async (websocket, serviceId, { authenticationData }) => {
        myServicesManagerService
            .onChangeInstanceListData(serviceId, (instanceList) => {
                websocket.send(JSON.stringify(instanceList))
            })
    }

    const ContainerListChange = async (websocket, serviceId, { authenticationData }) => {
        myServicesManagerService
            .onChangeContainerListData(serviceId, (containerList) => {
                websocket.send(JSON.stringify(containerList))
            })
    }

    const ImageBuildHistoryListChange = async (websocket, serviceId, { authenticationData }) => {
        myServicesManagerService
            .onChangeImageBuildHistoryListData(serviceId, (imageBuildHistoryList) => {
                websocket.send(JSON.stringify(imageBuildHistoryList))
            })
    }

    const ProvisionService = async ({
        packageId,
        serviceName,
        serviceDescription,
        startupParams,
        ports,
        networkmode
    }, { authenticationData }) => {
         const { userId, username } = authenticationData
        
        await myServicesManagerService
            .ProvisionService({
                username,
                packageId,
                serviceName,
                serviceDescription,
                startupParams, 
                ports,
                networkmode
            })
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