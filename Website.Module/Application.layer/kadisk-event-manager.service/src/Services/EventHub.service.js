const { Sequelize, DataTypes } = require('sequelize')
const EventEmitter = require('node:events')

const GetLocalISODateTime = () => {
	const now = new Date()
	const offset = now.getTimezoneOffset() * 60000
	return  (new Date(now - offset)).toISOString()
}

const EventHubService = (params) => {
    
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

    const EventModel = sequelize.define('Event', { 
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
        EventModel.create({ origin, type, content })
        eventEmitter.emit(EVENT_NOTIFICATION, {date: eventTime, ...event})
    }

    _Start()

    const RegisterEventListener = (f) => 
        eventEmitter.on(EVENT_NOTIFICATION, (event) => f(event))

    const ListEventHistory = async () => {
        try {
            const notificationHistory = await EventModel.findAll()
            return notificationHistory
        } catch (error) {
            console.error('Error listing history:', error)
            throw error
        }
    }

    return {
        ListEventHistory,
        RegisterEventListener,
        NotifyEvent
    }

}

module.exports = EventHubService