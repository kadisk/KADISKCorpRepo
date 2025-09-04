const { join, resolve} = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeRepositoryPersistentStoreManager = require("../Helpers/InitializeRepositoryPersistentStoreManager")
const CreateItemIndexer                          = require("../Helpers/CreateItemIndexer")
const CreateRepositoryStorageDomainService       = require("../Helpers/CreateRepositoryStorageDomainService")

const RepositoryStorageManagerService = (params) => {

const {
        onReady,
        repositoryStorageFilePath
    } = params

    const absolutRepositoryStorageFilePath = ConvertPathToAbsolutPath(repositoryStorageFilePath)
    const RepositoryPersistentStoreManager = InitializeRepositoryPersistentStoreManager(absolutRepositoryStorageFilePath)

    const {
        RepositoryNamespace : RepositoryNamespaceModel,
        RepositoryImported  : RepositoryImportedModel,
        RepositoryItem      : RepositoryItemModel
    } = RepositoryPersistentStoreManager.models
    
    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const RepositoryStorageDomainService = CreateRepositoryStorageDomainService({
        RepositoryNamespaceModel,
        RepositoryImportedModel,
        RepositoryItemModel
    })

    const {
        GetPackageById,
        GetRepositoryNamespaceId,
        GetItemById,
        ListLatestPackageItemsByUserId,
        ListRepositoryNamespace,
        ListRepositoriesByUserId,
        ListRepositoriesByNamespace,
        GetNamespace
    } = RepositoryStorageDomainService


    const _Start = async () => {
        //await RepositoryPersistentStoreManager.ConnectAndSync()
        onReady()
    }

    const CountNamespaceByUserId = (userId) =>  RepositoryNamespaceModel.count({ where: { userId } })

    _Start()

    return {
        IndexRepository: ItemIndexer.IndexRepository,
        CountNamespaceByUserId, 
        GetPackageById,
        GetRepositoryNamespaceId,
        GetItemById,
        ListLatestPackageItemsByUserId,
        ListRepositoryNamespace,
        ListRepositoriesByUserId,
        ListRepositoriesByNamespace,
        GetNamespace
    }
}

module.exports = RepositoryStorageManagerService
