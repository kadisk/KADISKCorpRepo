const EventEmitter = require("events")

const LifecycleStatusOptions = require("./LifecycleStatus.options")

const INITIAL_STATE = {
    status      : undefined,
    staticData  : {},
    dynamicData : {},
    error       : undefined
}

const CreateServiceRuntimeStateManager = () => {

    const {
        LOADING_INSTANCE_DATA,
        INSTANCE_DATA_LOADED,
        CONTAINER_DATA_LOADED,
        STARTING,
        STOPPING,
        RUNNING,
        FAILURE,
        TERMINATED,
        UNKNOWN
    } = LifecycleStatusOptions

    const state = {}

    const eventEmitter = new EventEmitter()

    const STATUS_CHANGE_EVENT                     = Symbol()
    const DYNAMIC_DATA_CHANGE_EVENT               = Symbol()

    const REQUEST_INSTANCE_DATA_EVENT             = Symbol()
    const REQUEST_CONTAINER_DATA_EVENT            = Symbol()
    const REQUEST_CONTAINER_INSPECTION_DATA_EVENT = Symbol()


    const _CreateInitialState = () => ({...INITIAL_STATE})

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

    const _RequestInstanceData            = (serviceId) => eventEmitter.emit(REQUEST_INSTANCE_DATA_EVENT, { serviceId })
    const _RequestContainerData           = (serviceId) => eventEmitter.emit(REQUEST_CONTAINER_DATA_EVENT, { serviceId, instanceId: _GetInstanceId(serviceId) })
    const _RequestContainerInspectionData = (serviceId) => eventEmitter.emit(REQUEST_CONTAINER_INSPECTION_DATA_EVENT, { serviceId, containerName: _GetContainerName(serviceId) })

    const _ProcessServiceStatusChange = (serviceId) => {
        switch (state[serviceId].status) {
            case LOADING_INSTANCE_DATA:
                _RequestInstanceData(serviceId)
                break
            case INSTANCE_DATA_LOADED:
                _RequestContainerData(serviceId)
                break
            case CONTAINER_DATA_LOADED:
                _RequestContainerInspectionData(serviceId)
                break
            case STARTING:
                console.log(`Service ${serviceId} is starting`)
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
                console.warn(`Service ${serviceId} has an unknown status: ${state[serviceId].status}`)
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
        state[serviceId].dynamicData[property] = Object.freeze(data)
        eventEmitter.emit(DYNAMIC_DATA_CHANGE_EVENT, { serviceId, property })
    }

    const _GetStaticData = (serviceId) => state[serviceId].staticData

    const _ReceiveInstanceData = (serviceId, instanceData) => {
        if(instanceData.serviceId === serviceId){
            const { id: instanceId, startupParams } = instanceData
            _SetData(serviceId, { instanceId, startupParams })
            ChangeServiceStatus(serviceId, INSTANCE_DATA_LOADED)
        } else {
            throw "Instance serviceId does not match the corresponding service."
        }
    }

    const _ReceiveContainerData = (serviceId, containerData) => {
        const { id:containerId, containerName  } = containerData
        _AppendData(serviceId, {containerId, containerName} )
        ChangeServiceStatus(serviceId, CONTAINER_DATA_LOADED)
    }

    const _ReceiveContainerInspectionData = (serviceId, containerInspectionData) => {
        const { State, NetworkSettings } = containerInspectionData
        _UpdateDynamicData(serviceId, "containerState", State) 
        _UpdateDynamicData(serviceId, "containerNetworkSettings", NetworkSettings) 
    }

    const _GetDynamicData = (serviceId, property) => {
        return state[serviceId].dynamicData[property] 
    }

    const _ReconcileServiceStatus = (serviceId) => {
        const containerState = _GetDynamicData(serviceId, "containerState")
        if(containerState.Running){
            ChangeServiceStatus(serviceId, RUNNING)
        }
    }

    const _ProcessDynamicDataChange = (serviceId, property) => {
        if(property === "containerState"){
            _ReconcileServiceStatus(serviceId)
        }
    }

    eventEmitter.on(STATUS_CHANGE_EVENT, ({ serviceId }) => _ProcessServiceStatusChange(serviceId))
    eventEmitter.on(DYNAMIC_DATA_CHANGE_EVENT, ({ serviceId, property })=> _ProcessDynamicDataChange(serviceId, property))

    const AddServiceInStateManagement = (serviceId) => {
        _ValidateServiceDoesNotExist()
        state[serviceId] = _CreateInitialState()
        ChangeServiceStatus(serviceId, LOADING_INSTANCE_DATA)
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

    const ChangeServiceStatus = (serviceId, newStatus) => {
        _ValidateServiceExist(serviceId)
        state[serviceId].status = newStatus
        eventEmitter.emit(STATUS_CHANGE_EVENT, { serviceId })
    }

    const onRequestInstanceData = (onRequestData) => {
        eventEmitter.on(REQUEST_INSTANCE_DATA_EVENT, async ({ serviceId }) => {
            const instanceData = await onRequestData(serviceId) 
            _ReceiveInstanceData(serviceId, instanceData)
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

    const onChangeServiceStatus = (f) => {
        eventEmitter.on(STATUS_CHANGE_EVENT, ({ serviceId }) => f(serviceId, state[serviceId].status))
    }


    return {
        AddServiceInStateManagement,
        GetServiceStatus,
        ChangeServiceStatus,
        onRequestInstanceData,
        onRequestContainerData,
        onRequestContainerInspectionData,
        onChangeServiceStatus
    }
}



module.exports = CreateServiceRuntimeStateManager