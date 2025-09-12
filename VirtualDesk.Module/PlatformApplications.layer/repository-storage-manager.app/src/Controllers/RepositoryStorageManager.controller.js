const RepositoryStorageManagerController = (params) => {

    const { 
        repositoryStorageManagerService 
    } = params

    const {
        GetTotalNamespaceByUserId,
        ListRepositories,
        ListRepositoryNamespace,
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        GetNamespace,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        GetMetadataByPackageId,
        ListBootablePackages,
        ListRepositoriesByUserId,
        GetPackageById,
        GetRepositoryImportedByNamespace,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetNamespaceByRepositoryId,
        GetItemById
    } = repositoryStorageManagerService

    const controllerServiceObject = {
        controllerName: "RepositoryStorageManagerController",
        GetTotalNamespaceByUserId,
        ListRepositories,
        ListRepositoryNamespace,
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        GetNamespace,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        GetMetadataByPackageId,
        ListBootablePackages,
        ListRepositoriesByUserId,
        GetPackageById,
        GetRepositoryImportedByNamespace,
        ListItemByRepositoryId,
        GetNamespaceByRepositoryId,
        GetRepositoryImported,
        GetItemById
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryStorageManagerController