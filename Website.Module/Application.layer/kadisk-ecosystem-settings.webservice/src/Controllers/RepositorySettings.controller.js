const path = require("path")

const RepositorySettingsController = (params) =>{

    const { 
        ecosystemdataHandlerService,
        ecosystemDefaultsFileRelativePath,
        jsonFileUtilitiesLib
    } = params

    const ReadJsonFile = jsonFileUtilitiesLib.require("ReadJsonFile")

    const _GetEcosystemDefaults =  async () => {
        const ecosystemDefaultFilePath = path.resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)
        return ecosystemDefaults
    }

    const _ResolvePathWithEcosystemDataPath = async (paramName) => {
        const ecosystemDefaults = await _GetEcosystemDefaults()
        return path.resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaults[paramName])
    }

    const _ReadConfigFile = async (paramName) => {
        const confFilePath = await _ResolvePathWithEcosystemDataPath(paramName)
        const configData = await ReadJsonFile(confFilePath)
        return configData
    }

    const ListRepositories = async () => {
        const repositoriesData = await _ReadConfigFile("REPOS_CONF_FILENAME_REPOS_DATA")

        return Object
            .keys(repositoriesData)
            .map((repositoryNamespace) => {
                return {
                    repositoryNamespace,
                    ...repositoriesData[repositoryNamespace]
                }
            })
    }

    const controllerServiceObject = {
        controllerName   : "RepositorySettingsController",
        ListRepositories
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = RepositorySettingsController