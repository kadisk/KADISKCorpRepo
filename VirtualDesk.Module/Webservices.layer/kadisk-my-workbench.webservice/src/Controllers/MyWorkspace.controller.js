const MyWorkspaceController = (params) => {

    const {
        myWorkspaceManagerService
    } = params

    const CreateNewRepository = (repositoryNamespace, { authenticationData }) => {
        const { userId, username } = authenticationData
        return myWorkspaceManagerService.CreateNewRepository({ userId, username, repositoryNamespace })
    }

    const ListRepositories = ({ authenticationData }) => {
        const { userId } = authenticationData
        return myWorkspaceManagerService.ListRepositories(userId)
    }

    const ImportRepository = ({ repositoryNamespace, sourceCodeURL }, { authenticationData }) => {
        const { userId, username } = authenticationData
        return myWorkspaceManagerService.ImportRepository({ userId, username, repositoryNamespace, sourceCodeURL })
    }
    
    const controllerServiceObject = {
        controllerName : "MyWorkspaceController",
        CreateNewRepository,
        ListRepositories,
        ImportRepository,
        GetItemHierarchy                    : myWorkspaceManagerService.GetItemHierarchy,
        GetRepositoryGeneralInformation     : myWorkspaceManagerService.GetRepositoryGeneralInformation,
        GetItemInformation                  : myWorkspaceManagerService.GetItemInformation,
        GetApplicationsRepositoryMetatadata : myWorkspaceManagerService.GetApplicationsRepositoryMetatadata,
        GetPackageSourceTree                : myWorkspaceManagerService.GetPackageSourceTree,
        GetPackageSourceFileContent         : myWorkspaceManagerService.GetPackageSourceFileContent,
        GetPackageMetadata                  : myWorkspaceManagerService.GetPackageMetadata
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyWorkspaceController