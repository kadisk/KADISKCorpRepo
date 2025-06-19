const EventEmitter = require("events")

const LifecycleStatusOptions = require("./LifecycleStatus.options")

const INITIAL_STATE = {
    status      : undefined,
    staticData  : {},
    dynamicData : {},
    error       : undefined
}

const CreateServiceRuntimeStateManager = () => {

    const { LOADING, LOADED, UNKNOWN } = LifecycleStatusOptions

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

    const _RequestContainerData = (serviceId) => {

    }

    const _ProcessServiceStatusChange = (serviceId) => {
        switch (state[serviceId].status) {
            case LifecycleStatusOptions.LOADING:
                console.log(`Service ${serviceId} is starting instance data loading`)
                _RequestInstanceData(serviceId)
                break
            case LifecycleStatusOptions.LOADED:
                console.log(`Service ${serviceId} has loaded instance data`)
                _RequestContainerData(serviceId)
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

    const _SetStaticData = (serviceId, data) => {
        state[serviceId].staticData = Object.freeze(data)
    }

    const _ReceiveInstanceData = (serviceId, instanceData) => {
        if(instanceData.serviceId === serviceId){
            const { id: instanceId, createdAt, startupParams } = instanceData
            _SetStaticData(serviceId, { instanceId, startupParams, createdAt })
            ChangeServiceStatus(serviceId, LOADED)
        } else {
            throw "Instance serviceId does not match the corresponding service."
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

    const SubscribeListenerRuntimeRequestInstanceData = (onRequestData) => {
        eventEmitter.on(REQUEST_INSTANCE_DATA_EVENT, async ({ serviceId }) => {
            const instanceData = await onRequestData(serviceId) 
            _ReceiveInstanceData(serviceId, instanceData)
        })

        
    }

    return {
        AddServiceInStateManagement,
        GetServiceStatus,
        ChangeServiceStatus,
        SubscribeListenerRuntimeRequestInstanceData
    }
}



module.exports = CreateServiceRuntimeStateManager