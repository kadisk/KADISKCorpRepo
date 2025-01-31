const { Sequelize, DataTypes } = require('sequelize')
const EventEmitter = require('node:events')

const GetLocalISODateTime = () => {
	const now = new Date()
	const offset = now.getTimezoneOffset() * 60000
	return  (new Date(now - offset)).toISOString()
}

const NotificationHubService = (params) => {
    
    const eventEmitter = new EventEmitter()
    const EVENT_NOTIFICATION = Symbol()

    const {
        storageFilePath,
        onReady 
    } = params

    const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: storageFilePath
    })

    const NotificationModel = sequelize.define('Notification', { 
        origin: DataTypes.STRING,
        type: DataTypes.STRING,
        content: DataTypes.STRING
    })

    const _Start = async () => {
        try {
            await sequelize.authenticate()
            await sequelize.sync()
            onReady()
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
        onReady()   
    }

    const NotifyEvent = (event) => {
        const eventTime = GetLocalISODateTime()
        const { origin, type, content } = event
        NotificationModel.create({ origin, type, content })
        eventEmitter.emit(EVENT_NOTIFICATION, {date: eventTime, ...event})
    }

    _Start()

    const RegisterNotificationListener = (f) => 
        eventEmitter.on(EVENT_NOTIFICATION, (event) => f(event))

    const ListNotificationHistory = async () => {
        try {
            const notificationHistory = await NotificationModel.findAll()
            return notificationHistory
        } catch (error) {
            console.error('Error listing history:', error)
            throw error
        }
    }

    return {
        ListNotificationHistory,
        RegisterNotificationListener,
        NotifyEvent
    }

}

module.exports = NotificationHubService