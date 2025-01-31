const NotificationHistoryController = (params) =>{
    
    const { 
        notificationHubService
    } = params

    const { ListNotificationHistory } = notificationHubService

    const controllerServiceObject = {
        controllerName : "NotificationHistoryController",
        ListNotificationHistory
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = NotificationHistoryController