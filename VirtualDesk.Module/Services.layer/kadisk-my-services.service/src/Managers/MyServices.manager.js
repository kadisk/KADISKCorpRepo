const fs = require("fs")
const { Sequelize, DataTypes } = require('sequelize')
const { join } = require("path")

const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())


const MyServicesManager = (params) => {

    const {
        onReady,
        storageFilePath
    } = params

    const absolutStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: absolutStorageFilePath
    })

    const RepositoryUploadModel = sequelize.define('RepositoryUpload', { 
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            namespace: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            filePath: {
                type: DataTypes.STRING,
                allowNull: false
            }
    })


    const _Start = async () => {
        await sequelize.authenticate()
        await sequelize.sync()
        onReady()
    }

    _Start()

    const _CheckRepositoryNamespaceExist = (namespace) => RepositoryUploadModel.findOne({ where: { namespace } })

    const RegisterRepositoryUpload = async ({userId, repositoryNamespace, repositoryFile}) => {
        const existingNamespace = await _CheckRepositoryNamespaceExist(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        const newRepository = await RepositoryUploadModel.create({ 
            namespace: repositoryNamespace,
            userId,
            repositoryCodePath, 
            filePath: repositoryFile
        })
        return newRepository
    }

    return {
        RegisterRepositoryUpload
    }

}

module.exports = MyServicesManager