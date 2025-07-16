const EventEmitter = require("events")

const LifecycleStatusOptions = require("./LifecycleStatus.options")


const CreateServiceRuntimeStateManager = () => {

    const {
        LOADING_LAST_INSTANCE_DATA,
        INSTANCE_DATA_LOADED,
        CONTAINER_DATA_LOADED,
        STARTING,
        STOPPING,
        STOPPED,
        RUNNING,
        FAILURE,
        TERMINATED,
        UNKNOWN
    } = LifecycleStatusOptions

    const state = {}

    const eventEmitter = new EventEmitter()

    const STATUS_CHANGE_EVENT                     = Symbol()
    const DYNAMIC_DATA_CHANGE_EVENT               = Symbol()
    const REQUEST_LAST_INSTANCE_DATA_EVENT        = Symbol()
    const REQUEST_CONTAINER_DATA_EVENT            = Symbol()
    const REQUEST_CONTAINER_INSPECTION_DATA_EVENT = Symbol()
    const REQUEST_START_CONTAINER_EVENT           = Symbol()
    const REQUEST_STOP_CONTAINER_EVENT            = Symbol()



    const _CreateInitialState = () => ({
        status      : undefined,
        staticData  : {},
        dynamicData : {},
        error       : undefined
    })

    const _ValidateServiceDoesNotExist = (serviceId) => {
        if (state[serviceId])
            throw new Error(`Service with ID ${serviceId} already exists`)
    }

    const _ValidateServiceExist = (serviceId) => {
        if (!state[serviceId])
            throw new Error(`Service with ID ${serviceId} does not exist`)
    }

    const _GetInstanceId    = (serviceId) => _GetStaticData(serviceId).instanceId
    const _GetContainerName = (serviceId) => _GetStaticData(serviceId).containerName

    const _RequestLastInstanceData        = (serviceId) => eventEmitter.emit(REQUEST_LAST_INSTANCE_DATA_EVENT, { serviceId })
    const _RequestContainerData           = (serviceId) => eventEmitter.emit(REQUEST_CONTAINER_DATA_EVENT, { serviceId, instanceId: _GetInstanceId(serviceId) })
    const _RequestContainerInspectionData = (serviceId) => eventEmitter.emit(REQUEST_CONTAINER_INSPECTION_DATA_EVENT, { serviceId, containerName: _GetContainerName(serviceId) })
    const _RequestStartContainer          = (serviceId) => eventEmitter.emit(REQUEST_START_CONTAINER_EVENT, { serviceId, containerHashId: _GetContainerHashId(serviceId) })
    const _RequestStopContainer           = (serviceId) => eventEmitter.emit(REQUEST_STOP_CONTAINER_EVENT, { serviceId, containerHashId: _GetContainerHashId(serviceId) })

    const _ProcessServiceStatusChange = (serviceId) => {
        switch (state[serviceId].status) {
            case LOADING_LAST_INSTANCE_DATA:
                _RequestLastInstanceData(serviceId)
                break
            case INSTANCE_DATA_LOADED:
                _RequestContainerData(serviceId)
                break
            case CONTAINER_DATA_LOADED:
                _RequestContainerInspectionData(serviceId)
                break
            case STARTING:
                _RequestContainerData(serviceId)
                break          
            case STOPPING:
                console.log(`Service ${serviceId} is stopping`)
                break
            case RUNNING:
                console.log(`Service ${serviceId} is running`)
                break
            case FAILURE:
                console.error(`Service ${serviceId} has failed`)
                break
            case TERMINATED:
                console.log(`Service ${serviceId} has been terminated`)
                break
            default:
                console.warn(`Service ${serviceId} has an unknown status: ${state[serviceId].status.description}`)
        }
    }

    const _SetData = (serviceId, data) => {
        state[serviceId].staticData = Object.freeze(data)
    }

    const _AppendData = (serviceId, data) => {
        const staticData = _GetStaticData(serviceId)
        _SetData(serviceId, { ...staticData, ...data } )
    }

    const _UpdateDynamicData = (serviceId, property, data) => {
        state[serviceId].dynamicData[property] = data
        eventEmitter.emit(DYNAMIC_DATA_CHANGE_EVENT, { serviceId, property })
    }

    const _GetStaticData = (serviceId) => state[serviceId].staticData
    
    const _GetDynamicData = (serviceId, property) => state[serviceId].dynamicData[property] 

    const _ReceiveLastInstanceData = (serviceId, instanceData) => {
        if(instanceData.serviceId === serviceId){
            const { id: instanceId, startupParams } = instanceData
            _SetData(serviceId, { instanceId, startupParams })
            _ChangeStatus(serviceId, INSTANCE_DATA_LOADED)
        } else {
            throw "Instance serviceId does not match the corresponding service."
        }
    }

    const _GetContainerHashId = (serviceId) => {
        const containerData = _GetDynamicData(serviceId, "containerData")
        return containerData && containerData.Id
    }

    const _FindServiceIdByContainerHashId = (containerHashId) => {
        for (const serviceId in state) {
            if (_GetContainerHashId(serviceId) === containerHashId)
                return serviceId
        }
    }

    const _ReceiveContainerData = (serviceId, containerData) => {
        const { id:containerId, containerName  } = containerData
        _AppendData(serviceId, {containerId, containerName} )
        _ChangeStatus(serviceId, CONTAINER_DATA_LOADED)
    }

    const _ReceiveContainerInspectionData = (serviceId, containerInspectionData) => {
        if(containerInspectionData){
            const { Id, State, NetworkSettings } = containerInspectionData
            _UpdateDynamicData(serviceId, "containerData", { Id, State, NetworkSettings })
        } else 
            _ChangeStatus(serviceId, TERMINATED)
    }

    const _ReconcileServiceStatus = (serviceId) => {
        const containerData = _GetDynamicData(serviceId, "containerData")

        const { State } = containerData

        if(State.Running){
            _ChangeStatus(serviceId, RUNNING)
        } else {
            _ChangeStatus(serviceId, STOPPED)
        }
    }

    const _ProcessDynamicDataChange = (serviceId, property) => {
        if(property === "containerData"){
            _ReconcileServiceStatus(serviceId)
        }
    }

    eventEmitter.on(STATUS_CHANGE_EVENT, ({ serviceId }) => _ProcessServiceStatusChange(serviceId))
    eventEmitter.on(DYNAMIC_DATA_CHANGE_EVENT, ({ serviceId, property })=> _ProcessDynamicDataChange(serviceId, property))

    const AddServiceInStateManagement = (serviceId) => {
        _ValidateServiceDoesNotExist()
        state[serviceId] = _CreateInitialState()
        _ChangeStatus(serviceId, LOADING_LAST_INSTANCE_DATA)
    }

    const _GetServiceState = (serviceId) => {
        _ValidateServiceExist(serviceId)    
        const serviceState = state[serviceId]
        return serviceState
    }

    const GetServiceStatus = (serviceId) => {
        try{
            const status = _GetServiceState(serviceId).status
            return status.description
        } catch(e) {
            console.log(e)
            return UNKNOWN.description
        }
    }

    const _ChangeStatus = (serviceId, newStatus) => {
        _ValidateServiceExist(serviceId)
        state[serviceId].status = newStatus
        eventEmitter.emit(STATUS_CHANGE_EVENT, { serviceId })
    }

    const onRequestInstanceData = (onRequestData) => {
        eventEmitter.on(REQUEST_LAST_INSTANCE_DATA_EVENT, async ({ serviceId }) => {
            const instanceData = await onRequestData(serviceId) 
            _ReceiveLastInstanceData(serviceId, instanceData)
        })
    }

    const onRequestContainerData = (onRequestData) => {
        eventEmitter.on(REQUEST_CONTAINER_DATA_EVENT, async ({ serviceId, instanceId }) => {
            const containerData = await onRequestData(instanceId) 
            _ReceiveContainerData(serviceId, containerData)
        })
    }
    
    const onRequestContainerInspectionData = (onRequestData) => {
        eventEmitter.on(REQUEST_CONTAINER_INSPECTION_DATA_EVENT, async ({ serviceId, containerName }) => {
            const containerInspectionData = await onRequestData(containerName)

            _ReceiveContainerInspectionData(serviceId, containerInspectionData)
        })
    }

    const onRequestStartContainer = (onRequestData) => {
        eventEmitter.on(REQUEST_START_CONTAINER_EVENT, ({ serviceId, containerHashId }) => {
            onRequestData(containerHashId)
        })
    }

    const onRequestStopContainer = (onRequestData) => {
        eventEmitter.on(REQUEST_STOP_CONTAINER_EVENT, ({ serviceId, containerHashId }) => {
            onRequestData(containerHashId)
        })
    }

    const onChangeServiceStatus = (f) => {
        eventEmitter.on(STATUS_CHANGE_EVENT, ({ serviceId }) => f({serviceId, status: GetServiceStatus(serviceId)}))
    }

    const _NotifyStoppingContainer = (containerHashId) => {
        const serviceId = _FindServiceIdByContainerHashId(containerHashId)
        _ChangeStatus(serviceId, STOPPING)
    }

    const _NotifyDieContainer = (containerHashId) => {
        const serviceId = _FindServiceIdByContainerHashId(containerHashId)
        _ChangeStatus(serviceId, STOPPED)
    }

    const _NotifyStartingContainer = (containerHashId) => {
        const serviceId = _FindServiceIdByContainerHashId(containerHashId)
        _ChangeStatus(serviceId, STARTING)
    }

    const NotifyInstanceSwap = ({
        serviceId,
        nextInstanceId
    }) => {
        

        
    }

    const NotifyContainerActivity = ({ ID, Action, Attributes }) => {

        switch(Action) {
            case "start":
                _NotifyStartingContainer(ID)
                break
            case "kill":
                _NotifyStoppingContainer(ID)
                break
            case "stop":
                break
            case "die":
                _NotifyDieContainer(ID)
                break
            case "attach":
            case "commit":
            case "copy":
            case "create":
            case "destroy":
            case "detach":
            case "exec_create":
            case "exec_detach":
            case "exec_die":
            case "exec_start":
            case "export":
            case "health_status":
            case "oom":
            case "pause":
            case "rename":
            case "resize":
            case "restart":
            case "top":
            case "unpause":
            case "update":
            default:
                console.log({ ID, Action, Attributes }) 
        }

    }

    const StartService = (serviceId) => _RequestStartContainer(serviceId)
    const StopService = (serviceId) => _RequestStopContainer(serviceId)

    const GetNetworksSettings  = async (serviceId) => {
        
        const containerData = _GetDynamicData(serviceId, "containerData")
        const { NetworkSettings } = containerData

        const { Ports, Networks } = NetworkSettings
        
        return {
            ports: Ports,
            networks: Object.keys(Networks)
                .map(networkName => {
                    const network = Networks[networkName]
                    return {
                        name: networkName,
                        ipAddress: network.IPAddress,
                        gateway: network.Gateway
                    }
                })
        }
    }

    /*const _RequestTerminateInstance = ( instanceId ) => {
        _RequestStopContainer(serviceId)
    }*/

    /*const UpdatePorts = async ({ serviceId, ports }) => {
        _ValidateServiceExist(serviceId)
        _RequestTerminateInstance(_GetInstanceId(serviceId))


    }*/

    return {
        AddServiceInStateManagement,
        GetServiceStatus,
        onRequestInstanceData,
        onRequestContainerData,
        onRequestContainerInspectionData,
        onRequestStartContainer,
        onRequestStopContainer,
        onChangeServiceStatus,
        NotifyContainerActivity,
        NotifyInstanceSwap,
        StartService,
        StopService,
        GetNetworksSettings,
        //UpdatePorts
    }
}



module.exports = CreateServiceRuntimeStateManager