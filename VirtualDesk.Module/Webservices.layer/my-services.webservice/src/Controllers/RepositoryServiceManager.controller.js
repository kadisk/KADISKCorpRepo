const RepositoryServiceManagerController = (params) => {

    const { myServicesManagerService } = params

    const ListRepositories = async (namespaceId, {authenticationData}) => {
        const { userId } = authenticationData
        const repositories = await myServicesManagerService.ListRepositories(namespaceId)

        return repositories
    }

    const ListNamespaces = async ({authenticationData}) => {
        const { userId } = authenticationData
        const namespaces = await myServicesManagerService.ListRepositoryNamespace(userId)

        return namespaces
    }
    const controllerServiceObject = {
        controllerName: "RepositoryServiceManagerController",
        ListNamespaces,
        ListRepositories
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryServiceManagerController