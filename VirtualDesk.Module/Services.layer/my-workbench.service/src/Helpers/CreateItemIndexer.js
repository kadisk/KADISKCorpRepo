const { resolve } = require("path")
const { 
    readdir
} = require('node:fs/promises')

const ListDir = async (path) => {
    const listItems = await readdir(path, { withFileTypes: true })
    const listDir =  listItems.filter((file) => file.isDirectory() )
    return listDir
}

const FilterByExt = (ext) => ({name}) => {
    const [ _, itemType] = name.split(".")
    return itemType === ext
}

const FilterByExtList = (extList) => ({name}) => {
    const [ _, itemType] = name.split(".")
    return extList.indexOf(itemType) > -1
}

const ListPackageItem = async (itemsDirPath) => {
    const repositoryDirectories = await ListDir(itemsDirPath)
    return repositoryDirectories.filter(FilterByExtList(["lib", "service", "webservice", "webgui", "webpapp", "app", "cli"]))
}

const ListItemByType = async (itemsDirPath, itemType) => {
    const repositoryDirectories = await ListDir(itemsDirPath)
    return repositoryDirectories.filter(FilterByExt(itemType))
}

const ScanPackageItemType = async ({
    itemsDirPath, 
    callbackfn
}) => {
    const dirList = await ListPackageItem(itemsDirPath)
    dirList.forEach(callbackfn)
}

const ScanRepositoryByItemType = async ({
    itemsDirPath,
    itemType, 
    callbackfn
}) => {
    const dirList = await ListItemByType(itemsDirPath, itemType)
    dirList.forEach(callbackfn)
}


const CreateItemIndexer = ({
    RepositoryItemModel
}) => {

    const _AddRepositoryItem = ({ repositoryId, itemName, itemType, itemPath, parentId }) => 
        RepositoryItemModel.create({ repositoryId, itemName, itemType, itemPath, parentId })
    
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
    
        ScanPackageItemType({
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
    
        ScanRepositoryByItemType({
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
    
    
        ScanPackageItemType({
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
    
        ScanRepositoryByItemType({
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

    const _IndexRepository = ({ repositoryId, repositoryCodePath }) => {

        ScanRepositoryByItemType({
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

    return {
        IndexRepository: _IndexRepository
    }

}

module.exports = CreateItemIndexer