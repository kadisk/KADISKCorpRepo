const { resolve, join } = require("path")
const { readFile } = require('node:fs/promises')

const ListFilesRecursive = require("../Helpers/ListFilesRecursive")

const MyWorkspaceManager = (params) => {

    const {
        onReady,
        ecosystemDefaultsFileRelativePath,
        jsonFileUtilitiesLib,
        ecosystemdataHandlerService,
        commandExecutorLib,
        repositoryStorageSocketPath,
        repositoryStorageServerManagerUrl,
        loadMetatadaDirLib
    } = params


    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")
    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")
    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    const RepositoryStorageCommand = async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .RepositoryStorageManagerAppInstance
            .RepositoryStorageManager
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: repositoryStorageServerManagerUrl,
            mainApplicationSocketPath: repositoryStorageSocketPath,
            CommandFunction: APICommandFunction
        })
    }

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const _Start = async () => {
        onReady()
    }

    _Start()

    const CreateNewRepository = async ({userId, repositoryCodePath, repositoryNamespace}) => {
        const existingNamespace = await RepositoryStorageCommand((API) => API.GetRepositoryImportedByNamespace({ repositoryNamespace }))

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        return newRepository
    }

    const GetItemHierarchy = async (repositoryId) => {

        const items = await RepositoryStorageCommand((API) => API.ListItemByRepositoryId({ repositoryId }))
        
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

    const GetRepositoryGeneralInformation = async (repositoryId) => {
        const namespaceData = await RepositoryStorageCommand((API) => API.GetNamespaceByRepositoryId({ repositoryId }))
        return {
            repositoryNamespace: namespaceData.namespace
        }
    }

    const GetRepositoryMetadata = async (repositoryId) => {
        const repositoryData = await RepositoryStorageCommand((API) => API.GetRepositoryImported({ repositoryId }))
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
        const itemData = await RepositoryStorageCommand((API) => API.GetItemById({ itemId }))
        const { id, itemName, itemType } = itemData
        return { id, itemName, itemType }
    }

    const GetPackageSourceTree = async (itemId) => {
        const itemData = await RepositoryStorageCommand((API) => API.GetItemById({ itemId }))
        const { itemPath, repositoryCodePath } = itemData
        const srcPath = join(repositoryCodePath, itemPath, "src")

        try {
            return await ListFilesRecursive(srcPath, repositoryCodePath)
        } catch (error) {
            throw new Error(`Error reading source tree: ${error.message}`)
        }
    }

    const GetPackageSourceFileContent = async ({itemId, sourceFilePath}) => {
        const itemData = await RepositoryStorageCommand((API) => API.GetItemById({ itemId }))
        const { itemName, itemType, repositoryCodePath } = itemData
        
        const absolutePath = join(repositoryCodePath, sourceFilePath)

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
        const itemData = await RepositoryStorageCommand((API) => API.GetItemById({ itemId }))
        const { itemPath, repositoryCodePath } = itemData
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const absolutePath = join(repositoryCodePath, itemPath)

        return await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.PKG_CONF_DIRNAME_METADATA,
            path: absolutePath
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