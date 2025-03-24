const fs = require("fs")
const { Sequelize, DataTypes } = require('sequelize')
const { resolve, join } = require("path")
const { 
    readdir
} = require('node:fs/promises')

const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const ListDir = async (path) => {
    const listItems = await readdir(path, { withFileTypes: true })
    const listDir =  listItems.filter((file) => file.isDirectory() )
    return listDir
}


const DownloadFile = require("./Helpers/DownloadFile")

const PrepareDirPath = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}


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

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: absolutStorageFilePath
    })

    const RepositoryModel = sequelize.define('Repository', { 
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            namespace: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            repositoryCodePath: DataTypes.STRING
    })


    const RepositoryItemModel = sequelize.define("RepositoryItem", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemPath: {
            type: DataTypes.STRING,
            allowNull: false
        },
        repositoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: RepositoryModel,
                key: 'id'
            },
            onDelete: "CASCADE"
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'RepositoryItems',
                key: 'id'
            },
            onDelete: "CASCADE"
        }
    })

    RepositoryModel.hasMany(RepositoryItemModel, {
        foreignKey: 'repositoryId',
        onDelete: 'CASCADE'
    })

    RepositoryItemModel.belongsTo(RepositoryModel, {
        foreignKey: 'repositoryId'
    })

    RepositoryItemModel.hasMany(RepositoryItemModel, {
        foreignKey: 'parentId',
        as: 'children',
        onDelete: 'CASCADE'
    })
    
    RepositoryItemModel.belongsTo(RepositoryItemModel, {
        foreignKey: 'parentId',
        as: 'parent'
    })

    const _ListPackageItem = async (itemsDirPath) => {
        const repositoryDirectories = await ListDir(itemsDirPath)
        return repositoryDirectories.filter(_FilterByExtList(["lib", "service", "webservice", "webgui", "webpapp", "app", "cli"]))
    }

    const _ListItemByType = async (itemsDirPath, itemType) => {
        const repositoryDirectories = await ListDir(itemsDirPath)
        return repositoryDirectories.filter(_FilterByExt(itemType))
    }

    const _ScanPackageItemType = async ({
        itemsDirPath, 
        callbackfn
    }) => {
        const dirList = await _ListPackageItem(itemsDirPath)
        dirList.forEach(callbackfn)
    }

    const _IndexPackage = async ({
        repositoryId,
        parentId,
        packageDirName,
        itemParentPath
    }) => {

        const [ itemName, itemType ] = packageDirName.split(".")
        const itemPath = resolve(itemParentPath, packageDirName)

        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath, parentId })
    }

    const _IndexGroup = async ({
        repositoryId,
        parentId,
        groupDirName,
        layerPath
    }) => {
        const [ itemName, itemType ] = groupDirName.split(".")
        const itemPath = resolve(layerPath, groupDirName)

        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath, parentId })

        _ScanPackageItemType({
            itemsDirPath: itemPath,
            callbackfn: (dirItem) => {
                _IndexPackage({
                    repositoryId,
                    parentId: itemData.id,
                    packageDirName: dirItem.name,
                    itemParentPath: itemPath
                })
            }
        })
        
    }

    const _IndexLayer = async ({
        repositoryId,
        parentId,
        layerDirName,
        modulePath
    }) => {
        const [ itemName, itemType ] = layerDirName.split(".")
        const itemPath = resolve(modulePath, layerDirName)

        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath, parentId })

        _ScanRepositoryByItemType({
            itemsDirPath: itemPath,
            itemType:"group", 
            callbackfn: (dirItem) => {
                _IndexGroup({
                    repositoryId,
                    parentId: itemData.id,
                    groupDirName: dirItem.name,
                    layerPath: itemPath
                })
            }
        })


        _ScanPackageItemType({
            itemsDirPath: itemPath,
            callbackfn: (dirItem) => {
                _IndexPackage({
                    repositoryId,
                    parentId: itemData.id,
                    packageDirName: dirItem.name,
                    itemParentPath: itemPath
                })
            }
        })
    }

    const _IndexModule = async ({
        repositoryId,
        moduleDirName,
        repositoryCodePath
    }) => {
        const [ itemName, itemType ] = moduleDirName.split(".")
        const itemPath = resolve(repositoryCodePath, moduleDirName)

        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath })

        _ScanRepositoryByItemType({
            itemsDirPath: itemPath,
            itemType:"layer", 
            callbackfn: (dirItem) => {
                _IndexLayer({
                    repositoryId,
                    parentId: itemData.id,
                    layerDirName: dirItem.name,
                    modulePath: itemPath
                })
            }
        })

    }

    const _FilterByExt = (ext) => ({name}) => {
        const [ _, itemType] = name.split(".")
        return itemType === ext
    }

    const _FilterByExtList = (extList) => ({name}) => {
        const [ _, itemType] = name.split(".")
        return extList.indexOf(itemType) > -1
    }

    const _ScanRepositoryByItemType = async ({
        itemsDirPath,
        itemType, 
        callbackfn
    }) => {
        const dirList = await _ListItemByType(itemsDirPath, itemType)
        dirList.forEach(callbackfn)
    }

    const _IndexRepository = ({ repositoryId, repositoryCodePath }) => {

        _ScanRepositoryByItemType({
            itemsDirPath: repositoryCodePath,
            itemType:"Module", 
            callbackfn: (dirItem) => {
                _IndexModule({
                    repositoryId,
                    moduleDirName: dirItem.name,
                    repositoryCodePath
                })
            }
        })
       
    }

    const _Start = async () => {
        await sequelize.authenticate()
        await sequelize.sync()
        onReady()
    }

    _Start()

    const _CheckRepositoryNamespaceExist = (namespace) => RepositoryModel.findOne({ where: { namespace } })

    const CreateNewRepository = async ({userId, username, repositoryNamespace}) => {
        const existingNamespace = await _CheckRepositoryNamespaceExist(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        const repositoryCodePath = resolve(absolutRepositoryEditorDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoryCodePath)
        const newRepository = await RepositoryModel.create({ namespace: repositoryNamespace, userId, repositoryCodePath})
        return newRepository
    }

    const _AddRepositoryItem = ({ repositoryId, itemName, itemType, itemPath, parentId }) => 
        RepositoryItemModel.create({ repositoryId, itemName, itemType, itemPath, parentId })

    const ListRepositories = (userId) => RepositoryModel.findAll({
        where: { userId }
    })

    const ImportRepository = async ({ repositoryNamespace, sourceCodeURL, userId, username }) => {

        const repositoryCreatedData = await CreateNewRepository({ userId, username, repositoryNamespace})
        const { repositoryCodePath } = repositoryCreatedData
        const filePath = await DownloadFile({ 
            url: sourceCodeURL, 
            destinationPath: repositoryCodePath
        })
        const newRepositoryCodePath = await ExtractTarGz(filePath, repositoryCodePath)
        const repoData = await _UpdateRepositoryCodePath({
            namespace:repositoryNamespace,
            newRepositoryCodePath,
            userId
        })

        _IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData

    }

    const _UpdateRepositoryCodePath = async ({
        namespace,
        newRepositoryCodePath,
        userId
    }) => {

        const repository = await _CheckRepositoryNamespaceExist(namespace)
        if (!repository) 
            throw new Error('Repository Namespace not found')
        
        await repository.update({ repositoryCodePath: newRepositoryCodePath, userId })
        return repository

    }

    const GetItemHierarchy = async (repositoryId) => {
        const items = await RepositoryItemModel.findAll({
            where: { repositoryId },
            raw: true
        })

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


    const GetRepositoryData = (repositoryId) => RepositoryModel.findOne({ where: { id:repositoryId } })
    const GetItemData = (itemId) => RepositoryItemModel.findOne({ where: { id:itemId } })

    const GetRepositoryGeneralInformation = async (repositoryId) => {
        const repositoryData = await GetRepositoryData(repositoryId)

        return {
            repositoryNamespace: repositoryData.namespace
        }
    }

    const GetRepositoryMetadata = async (repositoryId) => {
        const repositoryData = await GetRepositoryData(repositoryId)
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

        const itemData = await GetItemData(itemId)
        const { id, itemName, itemType } = itemData
        return { id, itemName, itemType }

    }

    const _ListFilesRecursive = async (dirPath, basePath) => {
        const entries = await readdir(dirPath, { withFileTypes: true })
        const tree = []

        for (const entry of entries) {
            const fullPath = resolve(dirPath, entry.name)
            if (entry.isDirectory()) {
                tree.push({
                    name: entry.name,
                    path:entry.path.replace(basePath, ""),
                    type: 'directory',
                    children: await _ListFilesRecursive(fullPath, basePath)
                })
            } else {
                tree.push({
                    name: entry.name,
                    path:entry.path.replace(basePath, ""),
                    type: 'file'
                })
            }
        }

        return tree
    }

    const GetPackageSourceTree = async (itemId) => {
        const itemData = await GetItemData(itemId)
        const { itemPath } = itemData
        const srcPath = resolve(itemPath, "src")
        
        try {
            return await _ListFilesRecursive(srcPath, srcPath)
        } catch (error) {
            throw new Error(`Error reading source tree: ${error.message}`)
        }
    }

    const GetPackageSourceFileContent = async ({itemId, sourceFilePath}) => {
        const itemData = await GetItemData(itemId)
        const { itemPath, itemName, itemType } = itemData

        const absolutePath = join(itemPath, "src", sourceFilePath)

        try {
            const content = await fs.promises.readFile(absolutePath, "utf8")
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
        const itemData = await GetItemData(itemId)
        const { itemPath} = itemData
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        return await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.PKG_CONF_DIRNAME_METADATA,
            path: itemPath
        })
    }

    return {
        CreateNewRepository,
        ListRepositories,
        ImportRepository,
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