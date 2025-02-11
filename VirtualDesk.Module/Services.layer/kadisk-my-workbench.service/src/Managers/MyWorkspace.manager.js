const { Sequelize, DataTypes } = require('sequelize')

const MyWorkspaceManager = (params) => {

    const {
        onReady,
        storageFilePath
    } = params

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: storageFilePath
    })

    const RepositoryModel = sequelize.define('Repository', { 
            namespace: DataTypes.STRING
    })

    const _Start = async () => {
        try {
            await sequelize.authenticate()
            await sequelize.sync()
            onReady()
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }

    _Start()

    const _CheckRepositoryNamespaceExist = (namespace) => RepositoryModel.findOne({ where: { namespace } })

    const CreateNewRepository = async ({ repositoryNamespace }) => {
        try {
            const existingNamespace = await _CheckRepositoryNamespaceExist(repositoryNamespace)

            if (existingNamespace) 
                throw new Error('Repository Namespace already exists')

            const newRepository = await RepositoryModel.create({ namespace: repositoryNamespace })
            return newRepository
        } catch (error) {
            console.error('Error creating repository:', error)
            throw error
        }
    }

    const ListRepositories = async () => {
        try {
            const repositories = await RepositoryModel.findAll()
            return repositories
        } catch (error) {
            console.error('Error listing repositories:', error)
            throw error
        }
    }
    
    return {
        CreateNewRepository,
        ListRepositories
    }

}

module.exports = MyWorkspaceManager