const fs = require("fs")

const PrepareDirPath = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

module.exports = PrepareDirPath