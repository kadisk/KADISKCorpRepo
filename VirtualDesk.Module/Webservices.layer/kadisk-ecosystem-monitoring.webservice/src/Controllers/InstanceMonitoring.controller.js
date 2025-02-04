const InstanceMonitoringController = (params) => {

    const { instanceMonitoringManagerService } = params

    const {
        GetInstancesOverview,
        GetInstanceMonitorData
    } = instanceMonitoringManagerService

    const controllerServiceObject = {
        controllerName : "InstanceMonitoringController",
        GetInstancesOverview,
        GetInstanceMonitorData
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = InstanceMonitoringController