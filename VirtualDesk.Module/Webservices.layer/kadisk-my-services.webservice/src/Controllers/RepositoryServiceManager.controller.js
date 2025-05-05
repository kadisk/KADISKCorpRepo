const RepositoryServiceManagerController = (params) => {

    const { myServicesManagerService } = params

    const ListRepositories = async ({authenticationData}) => {
        const { userId } = authenticationData
        const repositories = await myServicesManagerService.ListRepositories(userId)

        return repositories
    }


    const controllerServiceObject = {
        controllerName: "RepositoryServiceManagerController",
        ListRepositories
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryServiceManagerController