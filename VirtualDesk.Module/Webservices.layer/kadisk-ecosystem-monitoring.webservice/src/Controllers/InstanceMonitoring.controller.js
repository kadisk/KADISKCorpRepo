const InstanceMonitoringController = (params) => {

    const { instanceMonitoringManagerService } = params

    const controllerServiceObject = {
        controllerName : "InstanceMonitoringController",
        GetInstancesOverview: instanceMonitoringManagerService.GetInstancesOverview
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = InstanceMonitoringController