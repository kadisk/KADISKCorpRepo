
const EventEmitter = require("events")

const CreateStateManager = require("./CreateStateManager")

const UNKNOWN    = Symbol("UNKNOWN")
const CREATED    = Symbol("CREATED")
const WAITING    = Symbol("WAITING")
const LOADING    = Symbol("LOADING")
const STARTING   = Symbol("STARTING")
const STOPPING   = Symbol("STOPPING")
const STOPPED    = Symbol("STOPPED")
const RUNNING    = Symbol("RUNNING")
const FAILURE    = Symbol("FAILURE")
const FINISHED   = Symbol("FINISHED")
const TERMINATED = Symbol("TERMINATED")

const RequestTypes  = require("./Request.types")

const SERVICE_STATE_GROUP             = Symbol("SERVICE_STATE_GROUP")
const INSTANCE_STATE_GROUP            = Symbol("INSTANCE_STATE_GROUP")
const CONTAINER_STATE_GROUP           = Symbol("CONTAINER_STATE_GROUP")
const IMAGE_BUILD_HISTORY_STATE_GROUP = Symbol("IMAGE_BUILD_HISTORY_STATE_GROUP")

const CreateServiceRuntimeStateManager = () => {

    const {
        AddNewState,
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
        const { status, data } = GetState(SERVICE_STATE_GROUP, serviceId)
        switch (status) {
            case CREATED:
                break
            case WAITING:
                if(data.serviceName) {
                    _RequestData(RequestTypes.INSTANCE_DATA_LIST, { serviceId })
                    _RequestData(RequestTypes.IMAGE_BUILD_DATA_LIST, { serviceId })
                } else 
                    _RequestData(RequestTypes.SERVICE_DATA, { serviceId })
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
            case CREATED:
                const { data: serviceData } = GetState(SERVICE_STATE_GROUP, serviceId)
                
                _RequestData(RequestTypes.BUILD_NEW_IMAGE, {
                    serviceId,
                    instanceId,
                    serviceName        : serviceData.serviceName,
                    packageId          : serviceData.packageId,
                    repositoryCodePath : serviceData.repositoryCodePath,
                    startupParams      : data.startupParams,
                    networkmode        : data.networkmode,
                    ports              : data.ports
                })
                break
            case WAITING:
                _RequestData(RequestTypes.CONTAINER_DATA, { serviceId, instanceId })
                break
            case RUNNING:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, RUNNING)
                break
            case STOPPING:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, STOPPING)
                break
            case STOPPED:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, STOPPED)
                break
            case TERMINATED:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, TERMINATED)
            case STARTING:
            case LOADING:
                break
            default:
                console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
        }
    }

    const _ProcessContainerStatusChange = (containerId) => {
        const { status, data } = GetState(CONTAINER_STATE_GROUP, containerId)
        switch (status) {
            case WAITING:
                _RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                        serviceId     : data.serviceId,
                        instanceId    : data.instanceId,
                        containerId,
                        containerName : data.containerName
                    })
                break
            case STARTING:
                _RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                        serviceId     : data.serviceId,
                        instanceId    : data.instanceId,
                        containerId,
                        containerName : data.containerName
                    })
                break
            case RUNNING:
                ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, RUNNING)
                break
            case STOPPING:
                ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, STOPPING)
                break
            case STOPPED:
                ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, STOPPED)
                break
            case TERMINATED:
                ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, TERMINATED)
                break
            default:
                console.warn(`Container ${containerId} has an unknown status: ${status.description}`)
        }
    }

    const _ProcessImageBuildHistoryStatusChange = (buildId) => {
        const { status, data } = GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId)
        switch (status) {
            case WAITING:
                break
            default:
        }
    }

    onChangeStatus(SERVICE_STATE_GROUP,             ({ key: serviceId })   => _ProcessServiceStatusChange(serviceId))
    onChangeStatus(INSTANCE_STATE_GROUP,            ({ key: instanceId })  => _ProcessInstanceStatusChange(instanceId))
    onChangeStatus(CONTAINER_STATE_GROUP,           ({ key: containerId }) => _ProcessContainerStatusChange(containerId))
    onChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, ({ key: buildId })     => _ProcessImageBuildHistoryStatusChange(buildId))

    const _AddNewState = (group, key, data, status=WAITING) => {
        AddNewState(group, key)
        SetData(group, key, data)
        ChangeStatus(group, key, status)
    }

    const AddNewInstanceState = (serviceId, { instanceId, startupParams, ports, networkmode }) => 
        _AddNewState(INSTANCE_STATE_GROUP, instanceId, {serviceId, startupParams, ports, networkmode})

    const AddNewContainerState = (containerId, { instanceId, serviceId, containerName  }) => 
        _AddNewState(CONTAINER_STATE_GROUP, containerId, { instanceId, serviceId, containerName })

    const AddNewBuildState = (buildId, { tag, hashId, instanceId, serviceId }) => 
        _AddNewState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, { tag, hashId, instanceId, serviceId }, FINISHED)

    const _ReceiveInspectionData = ({ containerId, inspectionData }) => {
        if(inspectionData){
            const { Id, State, NetworkSettings } = inspectionData
            UpdateData(CONTAINER_STATE_GROUP, containerId, { Id, State, NetworkSettings })
            _ReconcileContainerStatus(containerId)
        } else 
            ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
    }

    const _ReceiveServiceData = ({
        serviceId,
        packageId,
        serviceName, 
        serviceDescription, 
        repositoryCodePath 
    }) => {
        UpdateData(SERVICE_STATE_GROUP, serviceId, { 
            serviceName,
            serviceDescription,
            repositoryCodePath,
            packageId
        })
        ChangeStatus(SERVICE_STATE_GROUP, serviceId, WAITING)
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
        AddNewState(SERVICE_STATE_GROUP, serviceId)
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
                case RequestTypes.INSTANCE_DATA_LIST:
                    ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
                    const instanceDataList = await onRequestData(requestType, { serviceId: requestData.serviceId })
                    if(instanceDataList.length > 0)
                        instanceDataList
                            .forEach(({ id:instanceId , startupParams, ports, networkmode }) => AddNewInstanceState(requestData.serviceId, {instanceId,  startupParams, ports, networkmode }))
                    else
                        ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, TERMINATED)
                    break
                case RequestTypes.IMAGE_BUILD_DATA_LIST:
                    const buildDataList = await onRequestData(requestType, { serviceId: requestData.serviceId })
                        buildDataList
                            .forEach(({ id:buildId , tag, hashId, instanceId }) => AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId}))
                    break
                case RequestTypes.SERVICE_DATA:
                    ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
                    const serviceData = await onRequestData(requestType, { serviceId: requestData.serviceId })
                    _ReceiveServiceData({
                        serviceId          : requestData.serviceId,
                        packageId          : serviceData.packageId,
                        serviceName        : serviceData.serviceName,
                        serviceDescription : serviceData.serviceDescription,
                        repositoryCodePath : serviceData.instanceRepositoryCodePath
                    })
                    break
                case RequestTypes.CONTAINER_DATA:
                    ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                    const containerData = await onRequestData(requestType, { instanceId: requestData.instanceId })
                    if(containerData){
                        const { id:containerId, containerName  } = containerData
                        AddNewContainerState(containerId, { instanceId: requestData.instanceId, serviceId:requestData.serviceId, containerName  })
                    } else ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, CREATED)
                    break
                case RequestTypes.CONTAINER_INSPECTION_DATA:
                    ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                    const inspectionData = await onRequestData(requestType, { containerName: requestData.containerName })
                    _ReceiveInspectionData({ containerId: requestData.containerId, inspectionData })
                    break
                case RequestTypes.START_CONTAINER:
                case RequestTypes.STOP_CONTAINER:
                    try{
                        await onRequestData(requestType, { containerHashId: requestData.containerHashId })
                    } catch(e){
                        console.log(e)
                        ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, FAILURE)
                    }
                    break
                case RequestTypes.CREATE_NEW_CONTAINER:
                    ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
                    const newContainerData = await onRequestData(requestType, requestData)
                    const { id:containerId, containerName  } = newContainerData
                    AddNewContainerState(containerId, {
                        instanceId: requestData.instanceId,
                        serviceId:requestData.serviceId,
                        containerName
                    })
                    break
                case RequestTypes.BUILD_NEW_IMAGE:
                    ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
                    const newImageBuildData = await onRequestData(requestType, requestData)
                    const {
                        id:buildId, tag, hashId, instanceId
                    } = newImageBuildData
                    AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId})
                    _RequestData(RequestTypes.CREATE_NEW_CONTAINER, { 
                        instanceId,
                        buildId,
                        tag,
                        serviceId   : requestData.serviceId,
                        serviceName : requestData.serviceName,
                        networkmode : requestData.networkmode,
                        ports       : requestData.ports
                    })
                    break
                default:
                    console.warn(`Unknown request type: ${requestType.description}`)
            }

        })
    }

    const onChangeServiceStatus = (f) => {
        onChangeStatus(SERVICE_STATE_GROUP, ({ key: serviceId }) => f({serviceId, status: GetServiceStatus(serviceId)}))
    }

    const _ChangeContainerStatusByHash = (containerHashId, newStatus) => {
        const containerId = FindKeyByPropertyData(CONTAINER_STATE_GROUP, "Id", containerHashId)
        if(containerId)
            ChangeStatus(CONTAINER_STATE_GROUP, containerId, newStatus)
        else console.log(`the container with hashId ${containerId} is not in the state manager`)
    }
    
    const NotifyContainerActivity = ({ ID, Action, Attributes }) => {

        switch(Action) {
            case "start":
                _ChangeContainerStatusByHash(ID, STARTING)
                break
            case "kill":
                _ChangeContainerStatusByHash(ID, STOPPING)
                break
            case "stop":
                break
            case "die":
                _ChangeContainerStatusByHash(ID, STOPPED)
                break
            case "destroy":
                _ChangeContainerStatusByHash(ID, TERMINATED)
                break
            case "attach":
            case "commit":
            case "copy":
            case "create":
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

    const ListInstanceStateByStatus = (serviceId, status) => {
        const instanceList = ListInstancesState(serviceId)
        return instanceList.filter((state) => state.status === status)
    }

    const StartService = async (serviceId) => {

        ListInstanceStateByStatus(serviceId, STOPPED)
        .forEach(({key:instanceId}) => {
            const data = FindData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
            _RequestData(RequestTypes.START_CONTAINER, { 
                serviceId, 
                instanceId, 
                containerHashId: data.Id
            })
        })

    }

    const StopService = (serviceId) => {
        ListInstanceStateByStatus(serviceId, RUNNING)
        .forEach(({key:instanceId}) => {
            const data = FindData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
            _RequestData(RequestTypes.STOP_CONTAINER, { 
                serviceId, 
                instanceId, 
                containerHashId: data.Id
            })
        })
    }

    const GetNetworksSettings  = async (serviceId) => {
        const data = FindData(CONTAINER_STATE_GROUP, "serviceId", serviceId)

        if(data){
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
    }

    const ListInstancesState = (serviceId) => ListStatesByPropertyData(INSTANCE_STATE_GROUP, "serviceId", serviceId)

    const ListInstances = (serviceId) => {
        const instanceDataList = ListInstancesState(serviceId)
            .map(state => {
                const { key: instanceId, status, data } = state
                return { instanceId, status:status.description, ...data }
            })
        return instanceDataList
    }

    const ListContainers = (serviceId) => {
        const stateList = ListStatesByPropertyData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
        const containerDataList = stateList.map(state => {
            const { key: containerId, status, data } = state
            return {containerId, status:status.description,...data}
        })
        return containerDataList
    }

    const ListImageBuildHistory = (serviceId) => {
        const stateList = ListStatesByPropertyData(IMAGE_BUILD_HISTORY_STATE_GROUP, "serviceId", serviceId)
        const buildDataList = stateList.map(state => {
            const { key: buildId, status, data } = state
            return {buildId, status:status.description,...data}
        })
        return buildDataList
    }

    const onChangeContainerListData = (serviceId, f) => {
        onChangeStatus(CONTAINER_STATE_GROUP, ({ key }) => {
            const { data } = GetState(CONTAINER_STATE_GROUP, key)
            if(data.serviceId == serviceId){
                const containerList = ListContainers(serviceId)
                f(containerList)
            }
        })
    }

    const onChangeInstanceListData = (serviceId, f) => {
        onChangeStatus(INSTANCE_STATE_GROUP, ({ key }) => {
            const { data } = GetState(INSTANCE_STATE_GROUP, key)
            if(data.serviceId == serviceId){
                const instanceList = ListInstances(serviceId)
                f(instanceList)
            }
        })
    }

    const onChangeImageBuildHistoryListData = (serviceId, f) => {
        onChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, ({ key }) => {
            const { data } = GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, key)
            if(data.serviceId == serviceId){
                const buildList = ListImageBuildHistory(serviceId)
                f(buildList)
            }
        })
    }

    return {
        AddServiceInStateManagement,
        GetServiceStatus,
        onRequestData,
        onChangeServiceStatus,
        NotifyContainerActivity,
        StartService,
        StopService,
        GetNetworksSettings,
        ListInstances,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeImageBuildHistoryListData
    }
}

module.exports = CreateServiceRuntimeStateManager