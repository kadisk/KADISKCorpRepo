const MyWorkspaceController = (params) => {

    const {
        myWorkspaceManagerService
    } = params
    
    const controllerServiceObject = {
        controllerName : "MyWorkspaceController",
        CreateNewRepository             : myWorkspaceManagerService.CreateNewRepository,
        ListRepositories                : myWorkspaceManagerService.ListRepositories,
        ImportRepository                : myWorkspaceManagerService.ImportRepository,
        GetItemHierarchy                : myWorkspaceManagerService.GetItemHierarchy,
        GetRepositoryGeneralInformation : myWorkspaceManagerService.GetRepositoryGeneralInformation,
        GetItemInformation              : myWorkspaceManagerService.GetItemInformation,
        GetApplicationsMetatadata       : myWorkspaceManagerService.GetApplicationsMetatadata,
        GetPackageSourceTree            : myWorkspaceManagerService.GetPackageSourceTree
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyWorkspaceController