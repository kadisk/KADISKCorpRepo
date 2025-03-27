const multer = require('multer')
const { join, extname } = require('path')
const fs = require('fs')
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path).replace('~', os.homedir())

const GetRequestParams = ({body, params:path, query}) => ({...path, ...body, ...query})

const RepositoryImportManagerController = (params) => {

    const { uploadDirPath, myServicesManagerService } = params

    const { RegisterRepositoryUpload } = myServicesManagerService
    
    const uploadAbsolutDirPath = ConvertPathToAbsolutPath(uploadDirPath)

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

            console.log({
                userId, 
                repositoryNamespace: params.repositoryNamespace, 
                repositoryFilePath
            })

            await RegisterRepositoryUpload({
                userId, 
                repositoryNamespace: params.repositoryNamespace, 
                repositoryFilePath
            })

            return response.json({
                filename: request.file.originalname,
                repositoryFilePath
            })


        })

    }

    const controllerServiceObject = {
        controllerName: "RepositoryImportManagerController",
        UploadRepository
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryImportManagerController