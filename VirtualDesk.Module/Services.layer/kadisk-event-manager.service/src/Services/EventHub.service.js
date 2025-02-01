const { Sequelize, DataTypes } = require('sequelize')
const EventEmitter = require('node:events')

const MAX_EVENT_LIST_LIMIT = 10

const GetLocalISODateTime = () => {
	const now = new Date()
	const offset = now.getTimezoneOffset() * 60000
	return  (new Date(now - offset)).toISOString()
}

const EventHubService = (params) => {
    
    const eventEmitter = new EventEmitter()
    const EVENT = Symbol()

    const {
        storageFilePath,
        onReady 
    } = params

    const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: storageFilePath
    })

    const EventModel = sequelize.define('EventLog', { 
        origin: DataTypes.STRING,
        type: DataTypes.STRING,
        sourceName: DataTypes.STRING,
        level: DataTypes.STRING,
        message: DataTypes.STRING,
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

        const {
            sourceName,
            type: level,
            message
        } = content

        EventModel.create({ origin, type, sourceName, level, message })

        eventEmitter.emit(EVENT, {date: eventTime, ...event})
    }

    _Start()

    const RegisterEventListener = (f) => 
        eventEmitter.on(EVENT, (event) => f(event))

    const ListEventHistory = async () => {
        try {
            const eventHistory = await EventModel.findAll({
                order:[['id', 'DESC']],
                limit: MAX_EVENT_LIST_LIMIT,
            })
            return eventHistory
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