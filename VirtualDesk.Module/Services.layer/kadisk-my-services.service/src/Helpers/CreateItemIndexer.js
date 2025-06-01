const { resolve, join } = require("path")
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

const ListPackageItem = async (parentDirPath) => {
    const repositoryDirectories = await ListDir(parentDirPath)
    return repositoryDirectories.filter(FilterByExtList(["lib", "service", "webservice", "webgui", "webpapp", "app", "cli"]))
}

const ListItemByType = async (parentDirPath, itemType) => {
    const repositoryDirectories = await ListDir(parentDirPath)
    return repositoryDirectories.filter(FilterByExt(itemType))
}

const ScanPackageItemType = async ({
    parentDirPath, 
    callbackfn
}) => {
    const dirList = await ListPackageItem(parentDirPath)
    dirList.forEach(callbackfn)
}

const ScanItemByType = async ({
    parentDirPath,
    itemType, 
    callbackfn
}) => {
    const dirList = await ListItemByType(parentDirPath, itemType)
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
        const itemPath = join(itemParentPath, packageDirName)
    
        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath, parentId })
    }

    const _IndexGroup = async ({
        repositoryId,
        parentId,
        groupDirName,
        layerPath,
        repositoryCodePath
    }) => {
        const [ itemName, itemType ] = groupDirName.split(".")
        const itemPath = join(layerPath, groupDirName)
        const itemAbsolutPath = resolve(repositoryCodePath, itemPath)
    
        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath, parentId })
    
        ScanPackageItemType({
            itemsDirPath: itemAbsolutPath,
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
        modulePath,
        repositoryCodePath
    }) => {
        const [ itemName, itemType ] = layerDirName.split(".")
        const itemPath = join(modulePath, layerDirName)
        const itemAbsolutPath = resolve(repositoryCodePath, itemPath)
    
        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath, parentId })
    
        ScanItemByType({
            parentDirPath: itemAbsolutPath,
            itemType:"group", 
            callbackfn: (dirItem) => {
                _IndexGroup({
                    repositoryId,
                    parentId: itemData.id,
                    groupDirName: dirItem.name,
                    layerPath: itemPath,
                    repositoryCodePath
                })
            }
        })
    
    
        ScanPackageItemType({
            parentDirPath: itemAbsolutPath,
            callbackfn: (dirItem) => {
                _IndexPackage({
                    repositoryId,
                    parentId: itemData.id,
                    packageDirName: dirItem.name,
                    itemParentPath: itemPath,
                    repositoryCodePath
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

        const itemAbsolutPath = resolve(repositoryCodePath, moduleDirName)
    
        const itemData = await _AddRepositoryItem({ repositoryId, itemName, itemType, itemPath: moduleDirName })
    
        ScanItemByType({
            parentDirPath: itemAbsolutPath,
            itemType:"layer", 
            callbackfn: (dirItem) => {
                _IndexLayer({
                    repositoryId,
                    parentId: itemData.id,
                    layerDirName: dirItem.name,
                    modulePath: moduleDirName,
                    repositoryCodePath
                })
            }
        })
    
    }

    const _IndexRepository = ({ repositoryId, repositoryCodePath }) => {

        ScanItemByType({
            parentDirPath: repositoryCodePath,
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