const RepositoryManagerController = (params) => {


    const UploadRepository = (repositoryNamespace, { authenticationData }) => {
        const { userId, username } = authenticationData
        
    }
    
    const controllerServiceObject = {
        controllerName : "RepositoryManagerController",
        UploadRepository
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryManagerController