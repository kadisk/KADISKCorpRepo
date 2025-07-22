
const EventEmitter = require("events")

const CreateStateManager = require("./CreateStateManager")

const LifecycleStatusOptions = Object.freeze({
    UNKNOWN               : Symbol("UNKNOWN"),
    WAITING               : Symbol("WAITING"),
    LOADING               : Symbol("LOADING"),
    STARTING              : Symbol("STARTING"),
    STOPPING              : Symbol("STOPPING"),
    STOPPED               : Symbol("STOPPED"),
    RUNNING               : Symbol("RUNNING"),
    FAILURE               : Symbol("FAILURE"),
    TERMINATED            : Symbol("TERMINATED")
})

const {
    WAITING,
    LOADING,
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
        ListStatesByPropertyData,
        FindData,
        onChangeStatus,
        SetData,
        UpdateData,
        FindKeyByPropertyData,
        GetDataByKey
    } = CreateStateManager()

    const eventEmitter = new EventEmitter()

    const REQUEST_EVENT = Symbol()

    const _ValidateServiceDoesNotExist = (serviceId) => {
        if (GetState(SERVICE_STATE_GROUP, serviceId))
            throw new Error(`Service with ID ${serviceId} already exists`)
    }

    const _RequestData = (requestType, requestData) => eventEmitter.emit(REQUEST_EVENT, { requestType, ... requestData})

    const _ProcessServiceStatusChange = (serviceId) => {
        switch (GetState(SERVICE_STATE_GROUP, serviceId).status) {
            case WAITING:
                _RequestData(RequestTypes.ACTIVE_INSTANCE_INFO_LIST, { serviceId })
                break
            case LOADING:
                break
            default:
                console.warn(`Service ${serviceId} has an unknown status: ${GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
        }
    }

    const _ProcessInstanceStatusChange = (instanceId) => {
        const { status, data } = GetState(INSTANCE_STATE_GROUP, instanceId)
        const { serviceId } = data
        switch (status) {
            case WAITING:
                _RequestData(RequestTypes.CONTAINER_DATA, { serviceId, instanceId })
                break
            default:
                console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
        }
    }

    const _ProcessContainerStatusChange = (containerId) => {
        const { status, data } = GetState(CONTAINER_STATE_GROUP, containerId)
        switch (status) {
            case WAITING:
            case STARTING:
                _RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                        serviceId: data.serviceId,
                        instanceId: data.instanceId,
                        containerId,
                        containerName: data.containerName
                    })
                break
            default:
                console.warn(`Container ${containerId} has an unknown status: ${status.description}`)
        }
    }

    onChangeStatus(SERVICE_STATE_GROUP,   ({ key: serviceId })   => _ProcessServiceStatusChange(serviceId))
    onChangeStatus(INSTANCE_STATE_GROUP,  ({ key: instanceId })  => _ProcessInstanceStatusChange(instanceId))
    onChangeStatus(CONTAINER_STATE_GROUP, ({ key: containerId }) => _ProcessContainerStatusChange(containerId))

    const _CreateNewState = (group, key, data) => {
        CreateNewState(group, key)
        SetData(group, key, data)
        ChangeStatus(group, key, WAITING)
    }

    const CreateNewInstanceState = (serviceId, instanceInfo) => {
        const { instanceId, startupParams, ports, networkmode } = instanceInfo
        _CreateNewState(INSTANCE_STATE_GROUP, instanceId, {serviceId, startupParams, ports, networkmode})
    }

    const CreateNewContainerState = (containerId, { instanceId, serviceId, containerName  }) => {
        _CreateNewState(CONTAINER_STATE_GROUP, containerId, { instanceId, serviceId, containerName })
    }

    const _ReceiveInspectionData = ({ containerId, inspectionData }) => {
        if(inspectionData){
            const { Id, State, NetworkSettings } = inspectionData
            UpdateData(CONTAINER_STATE_GROUP, containerId, { Id, State, NetworkSettings })
            _ReconcileContainerStatus(containerId)
        } else 
            ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
    }

    const _ReconcileContainerStatus = (containerId) => {
        const containerData = GetDataByKey(CONTAINER_STATE_GROUP, containerId)
        const { State } = containerData
        if (State.Running) {
            ChangeStatus(CONTAINER_STATE_GROUP, containerId, RUNNING)
        } else if (State.Status === "exited") {
            ChangeStatus(CONTAINER_STATE_GROUP, containerId, STOPPED)
        } else {
            ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
        }
    }

    const AddServiceInStateManagement = (serviceId) => {
        _ValidateServiceDoesNotExist()
        CreateNewState(SERVICE_STATE_GROUP, serviceId)
        ChangeStatus(SERVICE_STATE_GROUP, serviceId, WAITING)
    }
    
    const GetServiceStatus = (serviceId) => {
        try{
            const state = GetState(SERVICE_STATE_GROUP, serviceId)
            if (!state) {
                throw new Error(`Service with ID ${serviceId} does not exist`)
            }
            return state.status.description
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
                    ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
                    const instanceInfoList = await onRequestData(requestType, { serviceId: requestData.serviceId })
                    instanceInfoList
                        .forEach((instanceInfo) => CreateNewInstanceState(requestData.serviceId, instanceInfo))
                    break
                case RequestTypes.CONTAINER_DATA:
                    ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                    const containerData = await onRequestData(requestType, { instanceId: requestData.instanceId }) 
                    const { id:containerId, containerName  } = containerData
                    CreateNewContainerState(containerId, { instanceId: requestData.instanceId, serviceId:requestData.serviceId, containerName  })
                    break
                case RequestTypes.CONTAINER_INSPECTION_DATA:
                    ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                    const inspectionData = await onRequestData(requestType, { containerName: requestData.containerName })
                    _ReceiveInspectionData({ containerId: requestData.containerId, inspectionData })
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
        onChangeStatus(SERVICE_STATE_GROUP, ({ key: serviceId }) => f({serviceId, status: GetServiceStatus(serviceId)}))
    }

    const _ChangeContainerStatusByHash = (containerHashId, newStatus) => {
        const containerId = FindKeyByPropertyData(CONTAINER_STATE_GROUP, "Id", containerHashId)
        ChangeStatus(CONTAINER_STATE_GROUP, containerId, newStatus)
    }

    const _NotifyStoppingContainer = (containerHashId) => _ChangeContainerStatusByHash(containerHashId, STOPPING)
    const _NotifyDieContainer      = (containerHashId) => _ChangeContainerStatusByHash(containerHashId, STOPPED)
    const _NotifyStartingContainer = (containerHashId) => _ChangeContainerStatusByHash(containerHashId, STARTING)

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

    const ListInstances = async (serviceId) => {
        const stateList = ListStatesByPropertyData(INSTANCE_STATE_GROUP, "serviceId", serviceId)
        const instanceDataList = stateList.map(state => {
            const { key: instanceId, status, data } = state
            return { instanceId, status:status.description, ...data }
        })
        return instanceDataList
    }

    const ListContainers = async (serviceId) => {
        const stateList = ListStatesByPropertyData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
        const containerDataList = stateList.map(state => {
            const { key: containerId, status, data } = state
            return {containerId, status:status.description,...data}
        })
        return containerDataList
    }


    const onChangeContainerListData = (serviceId, f) => {
        onChangeStatus(CONTAINER_STATE_GROUP, async ({ key: serviceId }) => {
            const containerList = await ListContainers(serviceId)
            f(containerList)
        })
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
        GetNetworksSettings,
        ListInstances,
        ListContainers,
        onChangeContainerListData
    }
}

module.exports = CreateServiceRuntimeStateManager