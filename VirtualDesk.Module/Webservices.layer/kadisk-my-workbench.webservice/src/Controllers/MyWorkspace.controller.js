const MyWorkspaceController = (params) => {

    const {
        myWorkspaceManagerService
    } = params
    
    const CreateNewRepository = async (repositoryNamespace) => {
        return await myWorkspaceManagerService.CreateNewRepository({repositoryNamespace})
    }

    const ListRepositories = async () => {
        return await myWorkspaceManagerService.ListRepositories()
    }

    const controllerServiceObject = {
        controllerName : "MyWorkspaceController",
        CreateNewRepository,
        ListRepositories
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = MyWorkspaceController