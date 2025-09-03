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

    const UploadProcess = ({
        request, 
        response,
        next,
        username,
        onUpload
    }) => {
        
        const repositoriesDirPath = join(uploadAbsolutDirPath, username)

        if (!fs.existsSync(repositoriesDirPath)) fs.mkdirSync(repositoriesDirPath, { recursive: true })

        const uploadMiddleware = multer({ dest: repositoriesDirPath })

        uploadMiddleware.single('repositoryFile')(request, response, async (err) => {
            if (err) return next(err)
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
            const data = await onUpload(repositoryFilePath)
            return response.json(data)
        })
    }
    
    const UploadRepository = (request, response, next) => {
        const { authenticationData } = request
        const { userId, username } = authenticationData
        UploadProcess({
            request, 
            response,
            next,
            username,
            onUpload: async (repositoryFilePath) => {
                const params = GetRequestParams(request)
                return await myServicesManagerService.RegisterNamespaceAndRepositoryUploadedAndExtract({
                    userId, 
                    username,
                    repositoryNamespace: params.repositoryNamespace, 
                    repositoryFilePath
                })
            }
        })
    }

    const UpdateRepositoryWithUpload = (request, response, next) => {
        const { authenticationData } = request
        const { userId, username } = authenticationData
        UploadProcess({
            request, 
            response,
            next,
            username,
            onUpload: async (repositoryFilePath) => {
                const params = GetRequestParams(request)
                const namespaceData = await myServicesManagerService.GetNamespace(params.namespaceId)
                const repositoryImportedData =  await myServicesManagerService
                    .ExtractAndRegisterRepository({ 
                        username, 
                        repositoryNamespace: namespaceData.namespace,
                        namespaceId: namespaceData.id,
                        repositoryFilePath
                    })
                return {
                    repositoryNamespace: namespaceData,
                    repositoryImported: repositoryImportedData
                }
            }
        })
    }

    const GetRepositoryCodePath = ({
        repositoryNamespace,
        userId,
        username
    }) => {
        const uniqueRandomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        return join(uploadAbsolutDirPath, username+userId, `${repositoryNamespace}-${uniqueRandomHash}`)
    }

    const Clone = async ({
        repositoryCodePath,
        repositoryGitUrl,
        personalAccessToken
    }) => {
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
    }

    const UpdateRepositoryWithGitClone = async ({
        namespaceId,
        repositoryGitUrl,
        personalAccessToken
    }, { authenticationData }) => {
        const { userId, username } = authenticationData
        const namespaceData = await myServicesManagerService.GetNamespace(namespaceId)
        const repositoryCodePath = GetRepositoryCodePath({
            repositoryNamespace: namespaceData.namespace,
            userId,
            username
        })
        await Clone({
            repositoryCodePath,
            repositoryGitUrl,
            personalAccessToken
        })
        const repositoryImportedData = await myServicesManagerService
        .RegisterImportedRepository({
            namespaceId: namespaceData.id,
            repositoryCodePath,
            sourceType:"GIT_CLONE",
            sourceParams:{
                repositoryGitUrl,
                personalAccessToken
            }
        })
        return {
            repositoryNamespace: namespaceData,
            repositoryImported: repositoryImportedData
        }
    }

    const CloneRepository = async ({
        repositoryNamespace,
        repositoryGitUrl,
        personalAccessToken
    }, { authenticationData }) => {
        const { userId, username } = authenticationData
        const repositoryCodePath = GetRepositoryCodePath({
            repositoryNamespace,
            userId,
            username
        })
        await Clone({
            repositoryCodePath,
            repositoryGitUrl,
            personalAccessToken
        })
        const data = await myServicesManagerService
        .RegisterNamespaceAndRepositoryCloned({
                userId, 
                repositoryNamespace, 
                repositoryCodePath,
                sourceParams:{
                    repositoryGitUrl,
                    personalAccessToken
                }
        })
        return data
    }

    const ListProvisionedServices = ({ authenticationData }) => {
        const { userId } = authenticationData
        return myServicesManagerService.ListProvisionedServices(userId)
    }

    const GetServiceData = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetServiceData(serviceId)
    }

    const ListImageBuildHistory = (serviceId, { authenticationData }) => {
        return myServicesManagerService.ListImageBuildHistory(serviceId)
    }

    const ListInstances = (serviceId, { authenticationData }) => {
        return myServicesManagerService.ListInstances(serviceId)
    }

    const ListContainers = (serviceId, { authenticationData }) => {
        return myServicesManagerService.ListContainers(serviceId)
    }
    
    const ServicesStatusChange = async (websocket, { authenticationData }) => {
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
        return myServicesManagerService.GetServiceStatus(serviceId) 
    }

    const GetNetworksSettings = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetNetworksSettings(serviceId)
    }

    const GetInstanceStartupParamsData = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetInstanceStartupParamsData(serviceId)
    }

    const GetInstanceStartupParamsSchema = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetInstanceStartupParamsSchema(serviceId)
    }

    const GetInstancePortsData = (serviceId, { authenticationData }) => {
        return myServicesManagerService.GetInstancePortsData(serviceId)
    }

    const GetNetworkModeData = (serviceId, { authenticationData }) => {
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
        myServicesManagerService
            .onChangeInstanceListData(serviceId, (instanceList) => {
                websocket.send(JSON.stringify(instanceList))
            })
    }

    const ContainerListChange = async (websocket, serviceId, { authenticationData }) => {
        myServicesManagerService
            .onChangeContainerListData(serviceId, (containerList) => {
                websocket.send(JSON.stringify(containerList))
            })
    }

    const ImageBuildHistoryListChange = async (websocket, serviceId, { authenticationData }) => {
        myServicesManagerService
            .onChangeImageBuildHistoryListData(serviceId, (imageBuildHistoryList) => {
                websocket.send(JSON.stringify(imageBuildHistoryList))
            })
    }

    const controllerServiceObject = {
        controllerName: "MyServicesManagerController",
        GetMyServicesStatus,
        UploadRepository,
        UpdateRepositoryWithUpload,
        CloneRepository,
        UpdateRepositoryWithGitClone,
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