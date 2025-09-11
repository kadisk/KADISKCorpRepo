const Table = require('cli-table')

const CreateServiceManagerCommand = require('../Helpers/CreateServiceManagerCommand')

const ListServicesCommand = async ({ args, startupParams, params }) => {

    const {
        serviceOrchestratorSocketPath,
        serviceOrchestratorServerManagerUrl
    } = startupParams

    const {
        commandExecutorLib
    } = params

    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    const ServiceManagerCommand = CreateServiceManagerCommand({
        CommandExecutor,
        serviceOrchestratorServerManagerUrl,
        serviceOrchestratorSocketPath
    })

    const serviceInfoList = await ServiceManagerCommand((API) => API.ListServices())

    // Cria a tabela agrupando colunas
    const table = new Table({
        head: [
            'Status',
            'Service',
            'Origin Package',
            'Origin Repository'
        ]
    })

    serviceInfoList.forEach(service => {
        table.push([
            service.status,
            `[${service.serviceId}] ${service.serviceName}`,
            `[${service.originPackageId}] ${service.originPackageName}.${service.originPackageType}`,
            `[${service.originRepositoryId}] ${service.originRepositoryNamespace}`
        ])
    })

    console.log(table.toString())
}

module.exports = ListServicesCommand