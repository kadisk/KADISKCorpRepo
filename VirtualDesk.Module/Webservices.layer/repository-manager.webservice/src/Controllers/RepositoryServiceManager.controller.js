const multer = require('multer')
const { join, extname } = require('path')
const fs = require('fs')
const os = require('os')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

const ConvertPathToAbsolutPath = (_path) => join(_path).replace('~', os.homedir())
const GetRequestParams = ({body, params:path, query}) => ({...path, ...body, ...query})

const RepositoryServiceManagerController = (params) => {

    const { 
        uploadDirPath, 
        repositoryStorageManagerService 
    } = params

    const uploadAbsolutDirPath = ConvertPathToAbsolutPath(uploadDirPath)

    const ListRepositories = async (namespaceId, {authenticationData}) => {
        const { userId } = authenticationData
        const repositories = await repositoryStorageManagerService.ListRepositories(namespaceId)

        return repositories
    }

    const ListNamespaces = async ({authenticationData}) => {
        const { userId } = authenticationData
        const namespaces = await repositoryStorageManagerService.ListRepositoryNamespace(userId)

        return namespaces
    }

    const CheckRepositoryImported = async ({ authenticationData }) => {
        const { userId } = authenticationData
        const repositoryCount = await repositoryStorageManagerService.CountNamespaceByUserId(userId)
    
        if (repositoryCount > 0) {
            return "READY"
        } else {
            return "NO_REPOSITORIES"
        }
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
                return await repositoryStorageManagerService.RegisterNamespaceAndRepositoryUploadedAndExtract({
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
                const namespaceData = await repositoryStorageManagerService.GetNamespace(params.namespaceId)
                const repositoryImportedData =  await repositoryStorageManagerService
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
        const namespaceData = await repositoryStorageManagerService.GetNamespace(namespaceId)
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
        const repositoryImportedData = await repositoryStorageManagerService
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
        const data = await repositoryStorageManagerService
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

    const ListBootablePackages = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return repositoryStorageManagerService.ListBootablePackages({ userId, username })
    }

    const GetStartupParamsData = async (packageId) => { 
        const metadata = await repositoryStorageManagerService.GetMetadataByPackageId(packageId)

        return metadata
    }

    const controllerServiceObject = {
        controllerName: "RepositoryServiceManagerController",
        ListNamespaces,
        ListRepositories,
        CheckRepositoryImported,
        UploadRepository,
        UpdateRepositoryWithUpload,
        CloneRepository,
        UpdateRepositoryWithGitClone,
        ListBootablePackages,
        GetStartupParamsData
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryServiceManagerController