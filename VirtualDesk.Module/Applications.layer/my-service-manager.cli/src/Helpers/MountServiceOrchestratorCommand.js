
const CreateServiceOrchestratorCommand = require('./CreateServiceOrchestratorCommand')

const MountServiceOrchestratorCommand = ({ startupParams, params }) =>  {

    const {
        serviceOrchestratorSocketPath,
        serviceOrchestratorServerManagerUrl
    } = startupParams

    const {
        commandExecutorLib
    } = params

    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    return CreateServiceOrchestratorCommand({
        CommandExecutor,
        serviceOrchestratorServerManagerUrl,
        serviceOrchestratorSocketPath
    })
}

module.exports = MountServiceOrchestratorCommand
