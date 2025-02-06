const { randomUUID } = require("crypto")
const { resolve } = require("path")

const InstanceConnectionStatus = Object.freeze({
    CONNECTING: "CONNECTING",
    CONNECTED : "CONNECTED",
    UNAVAILABLE: "UNAVAILABLE"
})

const CreateMonitoringDatabaseHandler = require("../Helpers/CreateMonitoringDatabaseHandler")

const CreateConnectionClientHandler = () => {

    let clients = {}

    const AddNewClient = (socketFileId, communicationClient) => {
        clients[parseInt(socketFileId)] = communicationClient
    }

    const GetClient = (socketFileId) => clients[parseInt(socketFileId)]

    return {
        AddNewClient,
        GetClient
    }
}

const InstanceMonitoringManager = (params) => {

    const {
        ecosystemdataHandlerService,
        ecosystemDefaultsFileRelativePath,
        jsonFileUtilitiesLib,
        supervisorLib,
        storageFilePath,
        onReady 
    } = params

    const monitoringUUID = randomUUID()

    const MonitoringDatabaseHandler = CreateMonitoringDatabaseHandler({ monitoringUUID, storageFilePath })
    const ConnectionClientHandler = CreateConnectionClientHandler()

    //const WatchSocketDirectory       = supervisorLib.require("WatchSocketDirectory")
    const ListSocketFilesName          = supervisorLib.require("ListSocketFilesName")
    const CreateCommunicationInterface = supervisorLib.require("CreateCommunicationInterface")
    const ReadJsonFile                 = jsonFileUtilitiesLib.require("ReadJsonFile")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)
    let supervisorSocketsDirPath = undefined

    const _GetSocketFilePath = (socketFileName) => resolve(supervisorSocketsDirPath, socketFileName)

    const _ConvertSocketFileNamesToFilePaths = (socketFileNames) => socketFileNames.map(_GetSocketFilePath)


    const ConnectToInstance = async (socketFileId, socketFilePath) => {
        await MonitoringDatabaseHandler.RegisterConnectionStatusChange(socketFileId, InstanceConnectionStatus.CONNECTING)
        try{
            const communicationClient = await CreateCommunicationInterface(socketFilePath)
            ConnectionClientHandler.AddNewClient(socketFileId, communicationClient)
            await MonitoringDatabaseHandler.RegisterConnectionStatusChange(socketFileId, InstanceConnectionStatus.CONNECTED)
        }catch(e){
            await MonitoringDatabaseHandler.RegisterConnectionStatusChange(socketFileId, InstanceConnectionStatus.UNAVAILABLE)
        }
    }

    const _TryConnectInAllInstances = async () => {
        const socketFileList = await MonitoringDatabaseHandler.GetAllSocketFile()

        socketFileList
        .forEach(({id, socketFilePath}) => ConnectToInstance(id, socketFilePath))

    }

    const _Start = async () => {

        await MonitoringDatabaseHandler.Initialize()

        const socketsDirPath = await _GetSocketsDirPath()
        const socketFileNames = await ListSocketFilesName(socketsDirPath)
        const socketFilePaths = _ConvertSocketFileNamesToFilePaths(socketFileNames)

        await MonitoringDatabaseHandler.RegisterAllSocketFiles(socketFilePaths)

        _TryConnectInAllInstances()

        /*
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

    const _CallRPC = async (socketFileId, fname, fArgs) => {
        const communicationClient = ConnectionClientHandler.GetClient(socketFileId)
        const responseData = await communicationClient[fname](fArgs)
        return responseData
    }
    

    //const GetTaskInformation    = async (socketFileId) => await _CallRPC(socketFileId, "GetTask", taskId)
    const ListInstanceTasks     = async (socketFileId) => await _CallRPC(socketFileId, "ListTasks")
    const GetStartupArguments   = async (socketFileId) => await _CallRPC(socketFileId, "GetStartupArguments")
    const GetProcessInformation = async (socketFileId) => await _CallRPC(socketFileId, "GetProcessInformation")


    const GetInstancesOverview = async () => {
        try {
            const socketFileList = await MonitoringDatabaseHandler.GetAllSocketFile()
            const socketFileIds = socketFileList.map(({id})=> id)
            const connectionStatusLogs = await MonitoringDatabaseHandler.GetConnectionStatus(socketFileIds)

            const overview = connectionStatusLogs
            .map((rowData) => {
                const {
                    socketFileId,
                    createdAt,
                    status,
                    SocketFile:{
                        socketFilePath
                    }
                } = rowData
                return {
                    socketFileId,
                    socketFilePath,
                    createdAt,
                    status
                }
            })

            return overview
        } catch (error) {
            console.error('Error listing history:', error)
            throw error
        }
    }

    const GetInstanceMonitorData = async (socketFileId) => {
        return {
            startupArguments: await GetStartupArguments(socketFileId),
            processInformation: await GetProcessInformation(socketFileId),
            instanceTasks: await ListInstanceTasks(socketFileId)
        }
    }

    const monitoringObject = {
        //OverviewChangeListener,
        //GetMonitoringKeysReady,
        GetInstancesOverview,
        GetInstanceMonitorData
       // ListInstanceTasks,
      //  GetTaskInformation,
       // GetStartupArguments,
       // GetProcessInformation
    }
        
    _Start()
        
    return monitoringObject

}

module.exports = InstanceMonitoringManager