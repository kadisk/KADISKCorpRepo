const fs = require("fs")
const path = require("path")
const { pipeline } = require("stream")
const { promisify } = require("util")

const pipelineAsync = promisify(pipeline)

const DownloadFile = async ({
    url, 
    destinationPath
})  => {

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
        }
        const fileName = path.basename(url) 
        const filePath = path.resolve(destinationPath, fileName)
        const writer = fs.createWriteStream(filePath)
        await pipelineAsync(response.body, writer)
        return filePath
    } catch (error) {
        console.error(`Download failed: ${error.message}`)
        throw error
    }

}

module.exports = DownloadFile
