const { randomUUID } = require("crypto")
const { Sequelize, DataTypes } = require('sequelize')

const EventEmitter = require('node:events')
const { resolve } = require("path")
const colors = require("colors")

const AreArraysEqual = require("../Utils/AreArraysEqual")

const CreateInstanceSocketHandlerManager = require("../Helpers/CreateInstanceSocketHandlerManager")

const InstanceMonitoringManager = (params) => {

    const monitoringUUID = randomUUID()

    const {
        ecosystemdataHandlerService,
        ecosystemDefaultsFileRelativePath,
        jsonFileUtilitiesLib,
        supervisorLib,
        storageFilePath,
        onReady 
    } = params

    const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: storageFilePath
    })

   
    const SocketFileModel = sequelize.define('SocketFile', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        monitoringUUID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        socketFilePath: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })


    const InstanceConnectionEventsModel = sequelize.define("InstanceConnectionEvents", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        socketFileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: SocketFileModel,
                key: 'id'
            },
            onDelete: "CASCADE"
        }
    })

    SocketFileModel.hasMany(InstanceConnectionEventsModel, {
        foreignKey: 'socketFileId',
        onDelete: 'CASCADE'
    })
    
    InstanceConnectionEventsModel.belongsTo(SocketFileModel, {
        foreignKey: 'socketFileId'
    })


    const WatchSocketDirectory         = supervisorLib.require("WatchSocketDirectory")
    const ListSocketFilesName          = supervisorLib.require("ListSocketFilesName")
    const CreateCommunicationInterface = supervisorLib.require("CreateCommunicationInterface")
    const ReadJsonFile                 = jsonFileUtilitiesLib.require("ReadJsonFile")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)
    let supervisorSocketsDirPath = undefined

    const {
        Overview,
        TryInitializeSocketMonitoring,
        InitializeSocketMonitoring,
        GetMonitoringKeysReady,
        GetSocketMonitoringState,
        AddEventListener
    } = CreateInstanceSocketHandlerManager({
        helpers:{
            CreateCommunicationInterface,
            //NotifyEvent
        }
    })

    const _CreateHandlerSocketDirectoryChange = () => {
        
        let socketFileNameList = []

        const __ChangeList = (newList) => {
            socketFileNameList = newList
            NotifyEvent({
                origin: "InstanceMonitoringManager",
                type:"message",
                content: `A lista de sockets foi atualizada para ${colors.bold(newList.join(", "))}`
            })
        }

        const __HandlerSocketDirectoryChange = (newSocketFileNameList) => {
            if(!AreArraysEqual(newSocketFileNameList, socketFileNameList)){
                __ChangeList(newSocketFileNameList)
                newSocketFileNameList
                .forEach((socketFileName) => TryInitializeSocketMonitoring(_GetSocketFilePath(socketFileName)))
            }
        }
        
        return __HandlerSocketDirectoryChange
    }

    const _GetSocketFilePath = (socketFileName) => resolve(supervisorSocketsDirPath, socketFileName)

    const _ConvertSocketFileNamesToFilePaths = (socketFileNames) => socketFileNames.map(_GetSocketFilePath)

    const _RegisterAllSocketFiles = async (socketFilePaths) => {

        const listForCreate = socketFilePaths.map((socketFilePath) => {
            return {
                socketFilePath,
                monitoringUUID
            }
        })

        await SocketFileModel.bulkCreate(listForCreate)
    }

    const _Start = async () => {

        await sequelize.authenticate()
        await sequelize.sync()

        const socketsDirPath = await _GetSocketsDirPath()
        const socketFileNames = await ListSocketFilesName(socketsDirPath)
        const socketFilePaths = _ConvertSocketFileNamesToFilePaths(socketFileNames)

        await _RegisterAllSocketFiles(socketFilePaths)

        /*socketFileNames.forEach((socketFileName) => InitializeSocketMonitoring(_GetSocketFilePath(socketFileName)))

        const __HandlerSocketDirectoryChange = _CreateHandlerSocketDirectoryChange()

        WatchSocketDirectory({
            directoryPath: supervisorSocketsDirPath, 
            onChangeSocketFileList: __HandlerSocketDirectoryChange
        })*/
        onReady()

    }

    const _GetSocketsDirPath = async () => {
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)
        const socketsDirPath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaults.ECOSYSTEMDATA_CONF_DIRNAME_SUPERVISOR_UNIX_SOCKET_DIR)
        supervisorSocketsDirPath = socketsDirPath
        return socketsDirPath
    }

    const OverviewChangeListener = AddEventListener

    const _GetConnectionClient = (monitoringStateKey) => {
        const socketMonitoringState = GetSocketMonitoringState(monitoringStateKey)
        const communicationClient = socketMonitoringState.GetCommunicationClient()
        return communicationClient
    }

    const _CallRPC = async (monitoringStateKey, fname, fArgs) => {
        const communicationClient = _GetConnectionClient(monitoringStateKey)
        const responseData = await communicationClient[fname](fArgs)
        return responseData
    }

    const ListInstanceTasks     = async (monitoringStateKey) =>           await _CallRPC(monitoringStateKey, "ListTasks")
    const GetTaskInformation    = async ({monitoringStateKey, taskId}) => await _CallRPC(monitoringStateKey, "GetTask", taskId)
    const GetStartupArguments   = async (monitoringStateKey) =>           await _CallRPC(monitoringStateKey, "GetStartupArguments")
    const GetProcessInformation = async (monitoringStateKey) =>           await _CallRPC(monitoringStateKey, "GetProcessInformation")


    const GetInstancesOverview = async () => {
        try {
            const instancesOverview = await SocketFileModel.findAll()
            return instancesOverview
        } catch (error) {
            console.error('Error listing history:', error)
            throw error
        }
    }

    const monitoringObject = {
        OverviewChangeListener,
        GetMonitoringKeysReady,
        GetInstancesOverview,
        ListInstanceTasks,
        GetTaskInformation,
        GetStartupArguments,
        GetProcessInformation
    }
        
    _Start()
        
    return monitoringObject

}

module.exports = InstanceMonitoringManager