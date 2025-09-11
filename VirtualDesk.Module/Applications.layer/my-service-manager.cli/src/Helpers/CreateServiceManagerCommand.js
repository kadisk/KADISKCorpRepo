const CreateServiceManagerCommand = ({
    CommandExecutor,
    serviceOrchestratorServerManagerUrl,
    serviceOrchestratorSocketPath
}) => async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .ServiceOrchestratorAppInstance
            .ServiceManagerInterface
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: serviceOrchestratorServerManagerUrl,
            mainApplicationSocketPath: serviceOrchestratorSocketPath,
            CommandFunction: APICommandFunction
        })
    }

module.exports = CreateServiceManagerCommand

