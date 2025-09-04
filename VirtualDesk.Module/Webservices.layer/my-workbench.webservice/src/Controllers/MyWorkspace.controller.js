const multer = require('multer')
const { join, extname } = require('path')
const fs = require('fs')
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path).replace('~', os.homedir())

const GetRequestParams = ({body, params:path, query}) => ({...path, ...body, ...query})

const MyWorkspaceController = (params) => {

    const {
        myWorkspaceManagerService,
        repositoryStorageManagerService,
        uploadDirPath
    } = params

    const uploadAbsolutDirPath = ConvertPathToAbsolutPath(uploadDirPath)

    const CreateNewRepository = (repositoryNamespace, { authenticationData }) => {
        const { userId, username } = authenticationData
        return myWorkspaceManagerService.CreateNewRepository({ userId, username, repositoryNamespace })
    }

    const ListRepositories = ({ authenticationData }) => {
        const { userId } = authenticationData
        return repositoryStorageManagerService.ListRepositoryNamespace(userId)
    }

    const ImportRepository = ({ repositoryNamespace, sourceCodeURL }, { authenticationData }) => {
        const { userId, username } = authenticationData
        return myWorkspaceManagerService.ImportRepository({ userId, username, repositoryNamespace, sourceCodeURL })
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

            const repoData = await myWorkspaceManagerService
                .RegisterNamespaceAndRepositoryUploadedAndExtract({
                    userId, 
                    username,
                    repositoryNamespace: params.repositoryNamespace, 
                    repositoryFilePath
                })

            return response.json(repoData)

        })

    }
    
    const controllerServiceObject = {
        controllerName : "MyWorkspaceController",
        CreateNewRepository,
        ListRepositories,
        ImportRepository,
        UploadRepository,
        GetItemHierarchy                    : myWorkspaceManagerService.GetItemHierarchy,
        GetRepositoryGeneralInformation     : myWorkspaceManagerService.GetRepositoryGeneralInformation,
        GetItemInformation                  : myWorkspaceManagerService.GetItemInformation,
        GetApplicationsRepositoryMetatadata : myWorkspaceManagerService.GetApplicationsRepositoryMetatadata,
        GetPackageSourceTree                : myWorkspaceManagerService.GetPackageSourceTree,
        GetPackageSourceFileContent         : myWorkspaceManagerService.GetPackageSourceFileContent,
        GetPackageMetadata                  : myWorkspaceManagerService.GetPackageMetadata
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyWorkspaceController