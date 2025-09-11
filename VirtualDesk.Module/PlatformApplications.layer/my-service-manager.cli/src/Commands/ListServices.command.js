const Table = require('cli-table')

const MountServiceOrchestratorCommand = require('../Helpers/MountServiceOrchestratorCommand')

const ListServicesCommand = async ({ args, startupParams, params }) => {

    const ServiceOrchestratorCommand = MountServiceOrchestratorCommand({ startupParams, params })
    const serviceInfoList = await ServiceOrchestratorCommand((API) => API.ListServices())

    const table = new Table({
        head: [
            'Status',
            '[ID] Service',
            '[ID] Origin Package',
            '[ID] Origin Repository'
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