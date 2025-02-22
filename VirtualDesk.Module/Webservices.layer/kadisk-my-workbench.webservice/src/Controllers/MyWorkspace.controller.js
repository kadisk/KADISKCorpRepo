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
        GetItemHierarchy: myWorkspaceManagerService.GetItemHierarchy,
        GetGeneralInformation: myWorkspaceManagerService.GetGeneralInformation,
        GetApplicationsMetatadata: myWorkspaceManagerService.GetApplicationsMetatadata
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = MyWorkspaceController