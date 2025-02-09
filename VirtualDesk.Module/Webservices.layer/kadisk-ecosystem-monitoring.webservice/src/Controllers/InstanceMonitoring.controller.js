const InstanceMonitoringController = (params) => {

    const { instanceMonitoringManagerService } = params

    const {
        GetInstancesOverview,
        GetInstanceMonitorData,
        GetLogStreaming
    } = instanceMonitoringManagerService


    const LogStreaming = async (websocket, socketFileId) => {

        const logStreaming = await GetLogStreaming(socketFileId)

        logStreaming.on('data', (logData) => {
            websocket.send(JSON.stringify(logData))
        })
        logStreaming.on('error', (error) => {

            websocket.send(JSON.stringify(error))

        })

    }


    const controllerServiceObject = {
        controllerName : "InstanceMonitoringController",
        GetInstancesOverview,
        GetInstanceMonitorData,
        LogStreaming
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = InstanceMonitoringController