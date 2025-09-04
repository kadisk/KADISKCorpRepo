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
        ListRepositoriesByUserId,
        ListRepositoriesByNamespace,
        GetNamespace
    } = RepositoryStorageDomainService


    const _Start = async () => {
        //await RepositoryPersistentStoreManager.ConnectAndSync()
        onReady()
    }

    const CountNamespaceByUserId = (userId) =>  RepositoryNamespaceModel.count({ where: { userId } })


    const ListRepositoryNamespace = async (userId) => {
        const repositoryNamespaceDataList  = await RepositoryStorageDomainService.ListRepositoryNamespace(userId)
        
        const repositories = repositoryNamespaceDataList
            .map((repositoryData) => {
                const { id, namespace } = repositoryData
                return { id, namespace } 
            })

        return repositories
    }

    const ListRepositories = async (namespaceId) => {
        const repositories = await ListRepositoriesByNamespace(namespaceId)
        return repositories.map(({ id, createdAt, sourceType, sourceParams }) => ({
            id,
            createdAt,
            sourceType,
            sourceParams
        }))
    }

    _Start()

    return {
        IndexRepository: ItemIndexer.IndexRepository,
        CountNamespaceByUserId, 
        GetPackageById,
        GetRepositoryNamespaceId,
        GetItemById,
        ListLatestPackageItemsByUserId,
        ListRepositoriesByUserId,
        ListRepositories,
        ListRepositoryNamespace,
        GetNamespace
    }
}

module.exports = RepositoryStorageManagerService
