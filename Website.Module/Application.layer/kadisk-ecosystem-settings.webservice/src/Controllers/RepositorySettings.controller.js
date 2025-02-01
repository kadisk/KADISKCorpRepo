const EventEmitter = require('node:events')
const path = require("path")

const RepositorySettingsController = (params) =>{

    const { 
        ecosystemdataHandlerService,
        ecosystemDefaultsFileRelativePath,
        jsonFileUtilitiesLib,
        ecosystemInstallUtilitiesLib,
        notificationHubService
    } = params

    const { NotifyEvent } = notificationHubService

    const ReadJsonFile = jsonFileUtilitiesLib.require("ReadJsonFile")
    const UpdateRepository = ecosystemInstallUtilitiesLib.require("UpdateRepository")

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

    const UpdateRepositoryByNamespace = async (repositoryNamespace) => {
        
        const repositoriesData = await _ReadConfigFile("REPOS_CONF_FILENAME_REPOS_DATA")
        const {sourceData} = repositoriesData[repositoryNamespace]

        const ecosystemDefaults = await _GetEcosystemDefaults()


        const loggerEmitter = new EventEmitter()
        loggerEmitter
            .on("log", (dataLog) => NotifyEvent({
                origin: "SourcesController.UpdateRepositoryByNamespace",
                type:"log",
                content: dataLog
            }))

        await UpdateRepository({
            repositoryNamespace,
            sourceData,
            installDataDirPath: ecosystemdataHandlerService.GetEcosystemDataPath(),
            ecosystemDefaults,
            loggerEmitter
        })
    }

    const controllerServiceObject = {
        controllerName   : "RepositorySettingsController",
        ListRepositories,
        UpdateRepository: UpdateRepositoryByNamespace
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = RepositorySettingsController