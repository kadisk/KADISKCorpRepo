const fs = require("fs")
const { join, resolve} = require("path")

const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
    
const MyServicesManager = (params) => {

    const {
        onReady,
        storageFilePath,
        repositoriesSourceCodeDirPath,
        extractTarGzLib
    } = params

    const ExtractTarGz = extractTarGzLib.require("ExtractTarGz")

    const absolutStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)
    const absolutRepositoryEditorDirPath = ConvertPathToAbsolutPath(repositoriesSourceCodeDirPath)

    const PersistentStoreManager = InitializePersistentStoreManager(absolutStorageFilePath)
    const {
        Repository     : RepositoryModel,
        RepositoryItem : RepositoryItemModel
    } = PersistentStoreManager.models

    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const _GetRepositoryByNamaspace = (namespace) => RepositoryModel.findOne({ where: { namespace } })
    const _CreateRepository         = ({ repositoryNamespace , userId, repositoryCodePath }) => RepositoryModel.create({ namespace: repositoryNamespace, userId, repositoryCodePath})
    
    const _GetPrepareAndRepositoriesCodePath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutRepositoryEditorDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }


    const _Start = async () => {
        await PersistentStoreManager.ConnectAndSync()
        onReady()
    }

    _Start()

    const SaveUploadedRepository = async ({ repositoryNamespace, userId, username , repositoryFilePath }) => {
        const repositoriesCodePath = _GetPrepareAndRepositoriesCodePath({username, repositoryNamespace})

        const newRepositoryCodePath = await ExtractTarGz(repositoryFilePath, repositoriesCodePath)
        const repoData = await RecordNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath})

        ItemIndexer.IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData
    }

    const RecordNewRepository = async ({userId, repositoryCodePath, repositoryNamespace}) => {
        const existingNamespace = await _GetRepositoryByNamaspace(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        const newRepository = await _CreateRepository({ repositoryNamespace , userId, repositoryCodePath })
        return newRepository
    }

    const GetStatus = async (userId) => {
        const repositoryCount = await RepositoryModel.count({ where: { userId } });
    
        if (repositoryCount > 0) {
            return "READY"
        } else {
            return "NO_REPOSITORIES"
        }
    }

    return {
        SaveUploadedRepository,
        GetStatus
    }

}

module.exports = MyServicesManager