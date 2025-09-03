
const { resolve } = require("path")
const { 
    readdir
} = require('node:fs/promises')

const ListFilesRecursive = async (dirPath, basePath) => {
    const entries = await readdir(dirPath, { withFileTypes: true })
    const tree = []

    for (const entry of entries) {
        const fullPath = resolve(dirPath, entry.name)
        if (entry.isDirectory()) {
            tree.push({
                name: entry.name,
                path:entry.path.replace(basePath, ""),
                type: 'directory',
                children: await ListFilesRecursive(fullPath, basePath)
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

module.exports = ListFilesRecursive