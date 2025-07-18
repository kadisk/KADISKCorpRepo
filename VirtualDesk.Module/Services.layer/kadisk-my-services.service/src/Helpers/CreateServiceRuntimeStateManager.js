
const EventEmitter = require("events")

const CreateStateManager = require("./CreateStateManager")

const LifecycleStatusOptions = Object.freeze({
    UNKNOWN               : Symbol("UNKNOWN"),
    WAITING               : Symbol("WAITING"),
    SWAPPING_INSTANCE     : Symbol("SWAPPING_INSTANCE"),
    STARTING              : Symbol("STARTING"),
    STOPPING              : Symbol("STOPPING"),
    STOPPED               : Symbol("STOPPED"),
    RUNNING               : Symbol("RUNNING"),
    FAILURE               : Symbol("FAILURE"),
    TERMINATED            : Symbol("TERMINATED")
})

const {
        WAITING,
        STARTING,
        STOPPING,
        STOPPED,
        RUNNING,
        FAILURE,
        TERMINATED,
        UNKNOWN
    } = LifecycleStatusOptions


const RequestTypes  = require("./Request.types")

const SERVICE_STATE_GROUP = Symbol("SERVICE_STATE_GROUP")
const INSTANCE_STATE_GROUP = Symbol("INSTANCE_STATE_GROUP")
const CONTAINER_STATE_GROUP = Symbol("CONTAINER_STATE_GROUP")


const CreateServiceRuntimeStateManager = () => {

    const {
        CreateNewState,
        ChangeStatus,
        GetState,
        FindData,
        onChangeStatus,
        SetData,
        UpdateData,
        FindKey
    } = CreateStateManager()

    const eventEmitter = new EventEmitter()

    const STATUS_CHANGE_EVENT       = Symbol()
    //const DYNAMIC_DATA_CHANGE_EVENT = Symbol()
    const REQUEST_EVENT             = Symbol()

    const _ValidateServiceDoesNotExist = (serviceId) => {
        if (GetState(SERVICE_STATE_GROUP, serviceId))
            throw new Error(`Service with ID ${serviceId} already exists`)
    }

    const _ValidateServiceExist = (serviceId) => {
        if (!GetState(SERVICE_STATE_GROUP, serviceId))
            throw new Error(`Service with ID ${serviceId} does not exist`)
    }

    const _RequestData = (requestType, requestData) => eventEmitter.emit(REQUEST_EVENT, { requestType, ... requestData})

    const _ProcessServiceStatusChange = (serviceId) => {
        switch (GetState(SERVICE_STATE_GROUP, serviceId).status) {
            case WAITING:
                _RequestData(RequestTypes.ACTIVE_INSTANCE_INFO_LIST, { serviceId })
                break        
            default:
                console.warn(`Service ${serviceId} has an unknown status: ${GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
        }
    }

    const _ProcessInstanceStatusChange = (instanceId) => {
        const { status, serviceId } = GetState(INSTANCE_STATE_GROUP, instanceId)
        switch (status) {
            case WAITING:
                _RequestData(RequestTypes.CONTAINER_DATA, { serviceId, instanceId })
                break
            default:
                console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
        }
    }

    onChangeStatus(SERVICE_STATE_GROUP, ({ key: serviceId }) => _ProcessServiceStatusChange(serviceId))

    onChangeStatus(INSTANCE_STATE_GROUP, ({ key: instanceId }) => _ProcessInstanceStatusChange(instanceId))

    const _CreateNewState = (group, key, data) => {
        CreateNewState(group, key)
        SetData(group, key, data)
        ChangeStatus(group, key, WAITING)
    }

    const CreateNewInstanceState = (serviceId, instanceInfo) => {
        const { instanceId, startupParams, ports, networkmode } = instanceInfo
        _CreateNewState(CONTAINER_STATE_GROUP, instanceId, {serviceId, startupParams, ports, networkmode})
    }

    const CreateNewContainerState = (serviceId, { containerId, containerName  }) => {
        _CreateNewState(CONTAINER_STATE_GROUP, instanceId, { serviceId, containerName })
    }

    const _FindContainerIdByHash = (containerHashId) => 
        FindKey(CONTAINER_STATE_GROUP, "Id", containerHashId)

    const _ProcessInspectionData = ({ containerId, inspectionData }) => {
        if(inspectionData){
            const { Id, State, NetworkSettings } = inspectionData
            UpdateData(CONTAINER_STATE_GROUP, containerId, { Id, State, NetworkSettings })
        } else 
            ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
    }

    /*
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

    eventEmitter.on(DYNAMIC_DATA_CHANGE_EVENT, ({ serviceId, property })=> _ProcessDynamicDataChange(serviceId, property))
    */

    const AddServiceInStateManagement = (serviceId) => {
        _ValidateServiceDoesNotExist()
        CreateNewState(SERVICE_STATE_GROUP, serviceId)
        ChangeStatus(SERVICE_STATE_GROUP, serviceId, WAITING)
    }

    const _GetServiceState = (serviceId) => {
        _ValidateServiceExist(serviceId)    
        const serviceState = GetState(SERVICE_STATE_GROUP, serviceId)
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

    const onRequestData = (onRequestData) => {
        eventEmitter.on(REQUEST_EVENT, async (requestData) => {
            
            const { requestType } = requestData

            switch (requestType) {
                case RequestTypes.ACTIVE_INSTANCE_INFO_LIST:
                    const instanceInfoList = await onRequestData(requestType, { serviceId: requestData.serviceId })
                    instanceInfoList
                        .forEach((instanceInfo) => CreateNewInstanceState(requestData.serviceId, instanceInfo))
                    break
                case RequestTypes.CONTAINER_DATA:
                    const containerData = await onRequestData(requestType, { instanceId: requestData.instanceId }) 
                    const { id:containerId, containerName  } = containerData
                    CreateNewContainerState(requestData.serviceId, { containerId, containerName  })
                    _RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { serviceId, containerId, containerName })
                    break
                case RequestTypes.CONTAINER_INSPECTION_DATA:
                    const inspectionData = await onRequestData(requestType, { containerName: requestData.containerName })
                    _ProcessInspectionData({ containerId: requestData.containerId, inspectionData })
                    break
                case RequestTypes.START_CONTAINER:
                case RequestTypes.STOP_CONTAINER:
                    onRequestData(requestType, { containerHashId: requestData.containerHashId })
                    break
                default:
                    console.warn(`Unknown request type: ${requestType}`)
            }

        })
    }

    const onChangeServiceStatus = (f) => {
        eventEmitter.on(STATUS_CHANGE_EVENT, ({ serviceId }) => f({serviceId, status: GetServiceStatus(serviceId)}))
    }

    const _ChangeContainerStatus = (containerHashId, newStatus) => {
        const containerId = _FindContainerIdByHash(containerHashId)
        ChangeStatus(CONTAINER_STATE_GROUP, containerId, newStatus)
    }

    const _NotifyStoppingContainer = (containerHashId) => _ChangeContainerStatus(containerHashId, STOPPING)
    const _NotifyDieContainer      = (containerHashId) => _ChangeContainerStatus(containerHashId, STOPPED)
    const _NotifyStartingContainer = (containerHashId) => _ChangeContainerStatus(containerHashId, STARTING)

    const NotifyInstanceSwap = ({
        serviceId,
        nextInstanceId
    }) => {}

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

    const StartService = (serviceId) => {
        const data = FindData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
        _RequestData(RequestTypes.START_CONTAINER, { serviceId, containerHashId: data.Id })
    }

    const StopService = (serviceId) => {
        const data = FindData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
        _RequestData(RequestTypes.STOP_CONTAINER, { serviceId, containerHashId: data.Id })
    }

    const GetNetworksSettings  = async (serviceId) => {
        const data = FindData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
        const { NetworkSettings } = data
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

    return {
        AddServiceInStateManagement,
        GetServiceStatus,
        onRequestData,
        onChangeServiceStatus,
        NotifyContainerActivity,
        NotifyInstanceSwap,
        StartService,
        StopService,
        GetNetworksSettings
    }
}

module.exports = CreateServiceRuntimeStateManager