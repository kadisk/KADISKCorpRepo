const fs = require("fs")
const { Sequelize, DataTypes } = require('sequelize')
const { resolve } = require("path")
const { 
    readdir
} = require('node:fs/promises')



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
        repositoryEditorDirPath,
        extractTarGzLib
    } = params


    const ExtractTarGz = extractTarGzLib.require("ExtractTarGz")

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: storageFilePath
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

    const CreateNewRepository = async (repositoryNamespace) => {
        const existingNamespace = await _CheckRepositoryNamespaceExist(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        const repositoryCodePath = resolve(repositoryEditorDirPath, repositoryNamespace)
        PrepareDirPath(repositoryCodePath)
        const newRepository = await RepositoryModel.create({ namespace: repositoryNamespace, repositoryCodePath})
        return newRepository
    }

    const _AddRepositoryItem = ({ repositoryId, itemName, itemType, itemPath, parentId }) => 
        RepositoryItemModel.create({ repositoryId, itemName, itemType, itemPath, parentId })

    const ListRepositories = async () => {
        const repositories = await RepositoryModel.findAll()
        return repositories
    }

    const ImportRepository = async ({ repositoryNamespace, sourceCodeURL }) => {

        const repositoryCreatedData = await CreateNewRepository(repositoryNamespace)
        const { repositoryCodePath } = repositoryCreatedData
        const filePath = await DownloadFile({ 
            url: sourceCodeURL, 
            destinationPath: repositoryCodePath
        })
        const newRepositoryCodePath = await ExtractTarGz(filePath, repositoryCodePath)
        const repoData = await _UpdateRepositoryCodePath(repositoryNamespace, newRepositoryCodePath)

        _IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData

    }

    const _UpdateRepositoryCodePath = async (namespace, newRepositoryCodePath) => {

        const repository = await _CheckRepositoryNamespaceExist(namespace)
        if (!repository) 
            throw new Error('Repository Namespace not found')
        
        await repository.update({ repositoryCodePath: newRepositoryCodePath })
        return repository

    }
    
    return {
        CreateNewRepository,
        ListRepositories,
        ImportRepository
    }

}

module.exports = MyWorkspaceManager