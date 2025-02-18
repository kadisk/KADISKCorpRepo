const MyWorkspaceController = (params) => {

    const {
        myWorkspaceManagerService
    } = params
    
    const CreateNewRepository = async (repositoryNamespace) => 
        await myWorkspaceManagerService.CreateNewRepository(repositoryNamespace)

    const controllerServiceObject = {
        controllerName : "MyWorkspaceController",
        CreateNewRepository,
        ListRepositories: myWorkspaceManagerService.ListRepositories,
        ImportRepository: myWorkspaceManagerService.ImportRepository,
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = MyWorkspaceController