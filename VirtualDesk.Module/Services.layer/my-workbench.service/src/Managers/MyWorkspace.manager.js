const { resolve, join } = require("path")
const { readFile } = require('node:fs/promises')

const ListFilesRecursive = require("../Helpers/ListFilesRecursive")

const MyWorkspaceManager = (params) => {

    const {
        onReady,
        ecosystemDefaultsFileRelativePath,
        jsonFileUtilitiesLib,
        ecosystemdataHandlerService,
        repositoryStorageManagerService,
        loadMetatadaDirLib
    } = params


    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")
    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const _Start = async () => {
        onReady()
    }

    _Start()

    const CreateNewRepository = async ({userId, repositoryCodePath, repositoryNamespace}) => {
        const existingNamespace = await repositoryStorageManagerService.GetRepositoryImportedByNamespace(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        //const newRepository = await repositoryStorageManagerService.CreateRepository({ repositoryNamespace , userId, repositoryCodePath })
        return newRepository
    }

    const GetItemHierarchy = async (repositoryId) => {

        const items = await repositoryStorageManagerService.ListItemByRepositoryId(repositoryId)
        
        const __BuildTree = (parentId = null) => {
            return items
                .filter(item => item.parentId === parentId)
                .map(item => ({
                    id: item.id,
                    itemName: item.itemName,
                    itemType: item.itemType,
                    children: __BuildTree(item.id)
                }))
        }

        return __BuildTree()
    }

    const GetRepositoryGeneralInformation = async (namespaceId) => {
        const namespaceData = await repositoryStorageManagerService.GetNamespace(namespaceId)
        return {
            repositoryNamespace: namespaceData.namespace
        }
    }

    const GetRepositoryMetadata = async (repositoryId) => {
        const repositoryData = await repositoryStorageManagerService.GetRepositoryImported(repositoryId)
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        return await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
            path: repositoryData.repositoryCodePath
        })
    }

    const GetApplicationsRepositoryMetatadata = async(repositoryId) => {
        const packageMetadata = await GetRepositoryMetadata(repositoryId)
        return packageMetadata.applications
    }

    const GetItemInformation = async (itemId) => {

        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { id, itemName, itemType } = itemData
        return { id, itemName, itemType }

    }

    const GetPackageSourceTree = async (itemId) => {
        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { itemPath } = itemData
        const srcPath = resolve(itemPath, "src")
        
        try {
            return await ListFilesRecursive(srcPath, srcPath)
        } catch (error) {
            throw new Error(`Error reading source tree: ${error.message}`)
        }
    }

    const GetPackageSourceFileContent = async ({itemId, sourceFilePath}) => {
        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { itemPath, itemName, itemType } = itemData

        const absolutePath = join(itemPath, "src", sourceFilePath)

        try {
            const content = await readFile(absolutePath, "utf8")
            return {
                sourceFilePath,
                packageParent:`${itemName}.${itemType}`,
                parentItemId: itemId,
                content
            }
        } catch (error) {
            throw new Error(`Error reading file: ${error.message}`)
        }
    }

    const GetPackageMetadata = async (itemId) => {
        const itemData = await repositoryStorageManagerService.GetItemById(itemId)
        const { itemPath} = itemData
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        return await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.PKG_CONF_DIRNAME_METADATA,
            path: itemPath
        })
    }

    return {
        CreateNewRepository,
        GetItemHierarchy,
        GetRepositoryGeneralInformation,
        GetApplicationsRepositoryMetatadata,
        GetItemInformation,
        GetPackageSourceTree,
        GetPackageSourceFileContent,
        GetPackageMetadata
    }

}

module.exports = MyWorkspaceManager