const EventHistoryController = (params) =>{
    
    const { 
        eventHubService
    } = params

    const { ListEventHistory } = eventHubService

    const controllerServiceObject = {
        controllerName : "EventHistoryController",
        ListEventHistory
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = EventHistoryController