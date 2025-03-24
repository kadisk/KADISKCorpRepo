const multer = require('multer')
const { join, extname } = require('path')
const fs = require('fs')
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path).replace('~', os.homedir())

const RepositoryImportManagerController = (params) => {
    const { uploadDirPath } = params
    const uploadAbsolutDirPath = ConvertPathToAbsolutPath(uploadDirPath)

    if (!fs.existsSync(uploadAbsolutDirPath)) {
        fs.mkdirSync(uploadAbsolutDirPath, { recursive: true })
    }

    const upload = multer({ dest: uploadAbsolutDirPath })

    const UploadRepository = (request, response, next) => {
        upload.single('repositoryFile')(request, response, async (err) => {
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


            const newFilePath = join(uploadAbsolutDirPath, request.file.originalname)
		    fs.renameSync(request.file.path, newFilePath)
    
            return response.json({
                filename: request.file.originalname,
                filePath: newFilePath
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