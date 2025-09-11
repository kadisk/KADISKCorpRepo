const RepositoryStorageManagerController = (params) => {

    const { 
        repositoryStorageManagerService 
    } = params

    const {
        GetTotalNamespaceByUserId
    } = repositoryStorageManagerService

    const controllerServiceObject = {
        controllerName: "RepositoryStorageManagerController",
        GetTotalNamespaceByUserId,
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryStorageManagerController