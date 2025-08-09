const multer = require('multer')
const { join, extname } = require('path')
const fs = require('fs')
const os = require('os')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

const ConvertPathToAbsolutPath = (_path) => join(_path).replace('~', os.homedir())

const GetRequestParams = ({body, params:path, query}) => ({...path, ...body, ...query})

const MyServicesManagerController = (params) => {

    const { uploadDirPath, myServicesManagerService } = params
    
    const uploadAbsolutDirPath = ConvertPathToAbsolutPath(uploadDirPath)

    const GetMyServicesStatus = ({ authenticationData }) => {
        const { userId } = authenticationData
        return myServicesManagerService.GetStatus(userId)
    }

    const UploadRepository = (request, response, next) => {
    
        const { authenticationData } = request
        const { userId, username } = authenticationData

        const repositoriesDirPath = join(uploadAbsolutDirPath, username)

        if (!fs.existsSync(repositoriesDirPath)) {
            fs.mkdirSync(repositoriesDirPath, { recursive: true })
        }
    
        const uploadMiddleware = multer({ dest: repositoriesDirPath })

        uploadMiddleware.single('repositoryFile')(request, response, async (err) => {

            if (err) {
                return next(err)
            }
    
            if (!request.file) {
                const error = new Error('No file uploaded')
                error.status = 400
                return next(error)
            }
    
            const allowedFormats = ['.gz', '.zip']
            const fileExt = extname(request.file.originalname).toLowerCase()
    
            if (!allowedFormats.includes(fileExt)) {
                fs.unlinkSync(request.file.path)
                const error = new Error('Invalid file format')
                error.status = 400
                return next(error)
            }

            const repositoryFilePath = join(repositoriesDirPath, request.file.originalname)
            fs.renameSync(request.file.path, repositoryFilePath)


            const params = GetRequestParams(request)

            const repoData = await myServicesManagerService.SaveUploadedRepository({
                userId, 
                username,
                repositoryNamespace: params.repositoryNamespace, 
                repositoryFilePath
            })

            return response.json(repoData)

        })

    }

    const CloneRepository = async ({
        repositoryNamespace,
        repositoryGitUrl,
        personalAccessToken
    }, { authenticationData }) => {
        
        const { userId, username } = authenticationData

        const uniqueRandomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        const repositoryCodePath = join(uploadAbsolutDirPath, username+userId, `${repositoryNamespace}-${uniqueRandomHash}`)

        await git.clone({
            fs,
            http, 
            dir : repositoryCodePath,
            url: repositoryGitUrl,
                onAuth: () => ({
                    username: personalAccessToken,
                    password: ''
                })
        })

        const repoData = await myServicesManagerService
        .SaveClonedRepository({
                userId, 
                repositoryNamespace, 
                repositoryCodePath
        })
        return repoData

    }

    const ListProvisionedServices = ({ authenticationData }) => {
        const { userId } = authenticationData
        return myServicesManagerService.ListProvisionedServices(userId)
    }

    const GetServiceData = (serviceId, { authenticationData }) => {
        const { userId } = authenticationData
        return myServicesManagerService.GetServiceData(serviceId)
    }

    const ListImageBuildHistory = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.ListImageBuildHistory(serviceId)
    }

    const ListInstances = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.ListInstances(serviceId)
    }

    const ListContainers = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.ListContainers(serviceId)
    }
    
    const ServicesStatusChange = async (websocket, { authenticationData }) => {
        //const { userId } = authenticationData

        myServicesManagerService
            .onChangeServiceStatus(({ serviceId, status }) => {
                websocket.send(JSON.stringify({ serviceId, status }))
            })

    }

    const StartService = ( serviceId ) => 
        myServicesManagerService.StartService(serviceId)

    const StopService  = ( serviceId ) =>
        myServicesManagerService.StopService(serviceId)

    const GetServiceStatus = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.GetServiceStatus(serviceId) 
    }

    const GetNetworksSettings = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.GetNetworksSettings(serviceId)
    }

    const GetInstanceStartupParamsData = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.GetInstanceStartupParamsData(serviceId)
    }

    const GetInstanceStartupParamsSchema = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.GetInstanceStartupParamsSchema(serviceId)
    }

    const GetInstancePortsData = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.GetInstancePortsData(serviceId)
    }

    const GetNetworkModeData = (serviceId, { authenticationData }) => {
        //const { userId } = authenticationData
        return myServicesManagerService.GetNetworkModeData(serviceId)
    }

    const UpdateServicePorts = async ({ serviceId, ports }, { authenticationData }) => {
        const { userId, username } = authenticationData 
        await myServicesManagerService.UpdateServicePorts({ serviceId, ports })
    }

    const UpdateServiceStartupParams = async ({ serviceId, startupParams }, { authenticationData }) => {
        const { userId, username } = authenticationData 
        await myServicesManagerService.UpdateServiceStartupParams({ serviceId, startupParams })
    }

    const InstanceListChange = async (websocket, serviceId, { authenticationData }) => {
        //const { userId } = authenticationData

        myServicesManagerService
            .onChangeInstanceListData(serviceId, (instanceList) => {
                websocket.send(JSON.stringify(instanceList))
            })

    }

    const ContainerListChange = async (websocket, serviceId, { authenticationData }) => {
        //const { userId } = authenticationData

        myServicesManagerService
            .onChangeContainerListData(serviceId, (containerList) => {
                websocket.send(JSON.stringify(containerList))
            })

    }

    const ImageBuildHistoryListChange = async (websocket, serviceId, { authenticationData }) => {
        //const { userId } = authenticationData

        myServicesManagerService
            .onChangeImageBuildHistoryListData(serviceId, (imageBuildHistoryList) => {
                websocket.send(JSON.stringify(imageBuildHistoryList))
            })

    }

    const controllerServiceObject = {
        controllerName: "MyServicesManagerController",
        GetMyServicesStatus,
        UploadRepository,
        CloneRepository,
        ListProvisionedServices,
        GetServiceData,
        GetNetworksSettings,
        ListImageBuildHistory,
        ListInstances,
        ListContainers,
        ServicesStatusChange,
        InstanceListChange,
        ContainerListChange,
        ImageBuildHistoryListChange,
        GetServiceStatus,
        StartService,
        StopService,
        GetInstanceStartupParamsData,
        GetInstanceStartupParamsSchema,
        GetInstancePortsData,
        GetNetworkModeData,
        UpdateServicePorts,
        UpdateServiceStartupParams
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyServicesManagerController