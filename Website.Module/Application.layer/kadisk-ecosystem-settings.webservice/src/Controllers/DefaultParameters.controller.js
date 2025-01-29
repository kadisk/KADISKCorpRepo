const DefaultParametersController = (params) => {

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

    const controllerServiceObject = {
        controllerName   : "DefaultParametersController",
        GetDefaultParamaters: _GetEcosystemDefaults
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = DefaultParametersController