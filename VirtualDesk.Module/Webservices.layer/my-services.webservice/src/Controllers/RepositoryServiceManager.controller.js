const RepositoryServiceManagerController = (params) => {

    const { repositoryStorageManagerService } = params

    const ListRepositories = async (namespaceId, {authenticationData}) => {
        const { userId } = authenticationData
        const repositories = await repositoryStorageManagerService.ListRepositories(namespaceId)

        return repositories
    }

    const ListNamespaces = async ({authenticationData}) => {
        const { userId } = authenticationData
        const namespaces = await repositoryStorageManagerService.ListRepositoryNamespace(userId)

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