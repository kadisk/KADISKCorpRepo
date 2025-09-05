
const { resolve } = require("path")
const { 
    readdir
} = require('node:fs/promises')

const ListFilesRecursive = async (dirPath, basePathForRemove) => {
    const tree = []
    try {
        const entries = await readdir(dirPath, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = resolve(dirPath, entry.name)
            if (entry.isDirectory()) {
                tree.push({
                    name: entry.name,
                    path:entry.path.replace(basePathForRemove, ""),
                    type: 'directory',
                    children: await ListFilesRecursive(fullPath, basePathForRemove)
                })
            } else {
                tree.push({
                    name: entry.name,
                    path:entry.path.replace(basePathForRemove, ""),
                    type: 'file'
                })
            }
        }
    } catch(e){
        console.log(e)
    }

    return tree
}

module.exports = ListFilesRecursive