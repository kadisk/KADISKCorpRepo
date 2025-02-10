const MyWorkspaceController = (params) =>{
    
    const CreateNewRepository = (repositoryNamespace) => {
        console.log(repositoryNamespace)
    }

    const ListRepositories = () => {

    }

    const controllerServiceObject = {
        controllerName : "MyWorkspaceController",
        CreateNewRepository,
        ListRepositories
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = MyWorkspaceController