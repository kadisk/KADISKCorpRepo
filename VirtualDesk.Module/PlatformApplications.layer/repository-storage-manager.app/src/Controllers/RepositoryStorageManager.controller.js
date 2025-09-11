const RepositoryStorageManagerController = (params) => {

    const { 
        repositoryStorageManagerService 
    } = params


    const controllerServiceObject = {
        controllerName: "RepositoryStorageManagerController"
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryStorageManagerController