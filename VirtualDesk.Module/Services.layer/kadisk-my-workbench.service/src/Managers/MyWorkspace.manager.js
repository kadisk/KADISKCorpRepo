const { resolve, join } = require("path")
const { readFile } = require('node:fs/promises')

const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const DownloadFile                     = require("../Helpers/DownloadFile")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
const ListFilesRecursive               = require("../Helpers/ListFilesRecursive")

const MyWorkspaceManager = (params) => {

    const {
        onReady,
        storageFilePath,
        ecosystemDefaultsFileRelativePath,
        repositoriesSourceCodeDirPath,
        extractTarGzLib,
        jsonFileUtilitiesLib,
        ecosystemdataHandlerService,
        loadMetatadaDirLib
    } = params

    const absolutStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)
    const absolutRepositoryEditorDirPath = ConvertPathToAbsolutPath(repositoriesSourceCodeDirPath)

    const ExtractTarGz = extractTarGzLib.require("ExtractTarGz")
    const ReadJsonFile = jsonFileUtilitiesLib.require("ReadJsonFile")
    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const PersistentStoreManager = InitializePersistentStoreManager(absolutStorageFilePath)
    const {
        Repository     : RepositoryModel,
        RepositoryItem : RepositoryItemModel
    } = PersistentStoreManager.models

    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const _Start = async () => {
        await PersistentStoreManager.ConnectAndSync()
        onReady()
    }

    _Start()
    
    const _GetRepositoryByUserId    = (userId)    => RepositoryModel.findAll({where: { userId }})
    const _GetRepositoryByNamaspace = (namespace) => RepositoryModel.findOne({ where: { namespace } })
    const _GetRepositoryById        = (id)        => RepositoryModel.findOne({ where: { id } })
    const _CreateRepository         = ({ repositoryNamespace , userId, repositoryCodePath }) => RepositoryModel.create({ namespace: repositoryNamespace, userId, repositoryCodePath})

    const _GetAllItemByRepositoryId = (repositoryId) => RepositoryItemModel.findAll({ where: { repositoryId }, raw: true})
    const _GetItemById              = (id)           => RepositoryItemModel.findOne({ where: { id } })

    const _GetPrepareAndRepositoriesCodePath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutRepositoryEditorDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const CreateNewRepository = async ({userId, repositoryCodePath, repositoryNamespace}) => {
        const existingNamespace = await _GetRepositoryByNamaspace(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        const newRepository = await _CreateRepository({ repositoryNamespace , userId, repositoryCodePath })
        return newRepository
    }

    const ImportRepository = async ({ repositoryNamespace, sourceCodeURL, userId, username }) => {

        const repositoriesCodePath = _GetPrepareAndRepositoriesCodePath({username, repositoryNamespace})
        
        const filePath = await DownloadFile({ 
            url: sourceCodeURL, 
            destinationPath: repositoriesCodePath
        })
        const newRepositoryCodePath = await ExtractTarGz(filePath, repositoriesCodePath)
        
        const repoData = await CreateNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath})

        ItemIndexer.IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData

    }

    const SaveUploadedRepository = async ({ repositoryNamespace, userId, username , repositoryFilePath }) => {
        const repositoriesCodePath = _GetPrepareAndRepositoriesCodePath({username, repositoryNamespace})

        const newRepositoryCodePath = await ExtractTarGz(repositoryFilePath, repositoriesCodePath)
        const repoData = await CreateNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath})

        ItemIndexer.IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData
    }

    /*const _UpdateRepositoryCodePath = async ({
        namespace,
        newRepositoryCodePath,
        userId
    }) => {

        const repository = await _GetRepositoryByNamaspace(namespace)
        if (!repository) 
            throw new Error('Repository Namespace not found')
        
        await repository.update({ repositoriesCodePath: newRepositoryCodePath, userId })
        return repository

    }*/


    const GetItemHierarchy = async (repositoryId) => {

        const items = await _GetAllItemByRepositoryId(repositoryId)

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
        const repositoryData = await _GetRepositoryById(repositoryId)

        return {
            repositoryNamespace: repositoryData.namespace
        }
    }

    const GetRepositoryMetadata = async (repositoryId) => {
        const repositoryData = await _GetRepositoryById(repositoryId)
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

        const itemData = await _GetItemById(itemId)
        const { id, itemName, itemType } = itemData
        return { id, itemName, itemType }

    }

    const GetPackageSourceTree = async (itemId) => {
        const itemData = await _GetItemById(itemId)
        const { itemPath } = itemData
        const srcPath = resolve(itemPath, "src")
        
        try {
            return await ListFilesRecursive(srcPath, srcPath)
        } catch (error) {
            throw new Error(`Error reading source tree: ${error.message}`)
        }
    }

    const GetPackageSourceFileContent = async ({itemId, sourceFilePath}) => {
        const itemData = await _GetItemById(itemId)
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
        const itemData = await _GetItemById(itemId)
        const { itemPath} = itemData
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        return await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.PKG_CONF_DIRNAME_METADATA,
            path: itemPath
        })
    }

    return {
        CreateNewRepository,
        ListRepositories: _GetRepositoryByUserId,
        ImportRepository,
        GetItemHierarchy,
        GetRepositoryGeneralInformation,
        GetApplicationsRepositoryMetatadata,
        GetItemInformation,
        GetPackageSourceTree,
        GetPackageSourceFileContent,
        GetPackageMetadata,
        SaveUploadedRepository
    }

}

module.exports = MyWorkspaceManager