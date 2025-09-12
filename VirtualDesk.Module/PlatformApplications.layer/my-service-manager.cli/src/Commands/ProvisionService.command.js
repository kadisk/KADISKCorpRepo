
const ConvertPathToAbsolutPath = require("../Utils/ConvertPathToAbsolutPath")

const MountServiceOrchestratorCommand = require('../Helpers/MountServiceOrchestratorCommand')
const { resolve } = require("path")

const ProvisionServiceCommand = async ({ args, startupParams, params }) => {
    const { provisionFilePath } = args
    const {
        jsonFileUtilitiesLib,
    } = params
    const ReadJsonFile = jsonFileUtilitiesLib.require("ReadJsonFile")
    const absolutProvisionFilePath = resolve(process.cwd(), ConvertPathToAbsolutPath(provisionFilePath))
    const provisionData = await ReadJsonFile(absolutProvisionFilePath)
    const ServiceOrchestratorCommand = MountServiceOrchestratorCommand({ startupParams, params })
    await ServiceOrchestratorCommand((API) => API.ProvisionService(provisionData))
}

module.exports = ProvisionServiceCommand
