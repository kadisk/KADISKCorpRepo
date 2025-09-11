const Table = require('cli-table')
const MountServiceOrchestratorCommand = require('../Helpers/MountServiceOrchestratorCommand')

const formatStartupParams = (startupParams = {}) => {
    // Exclui campos já exibidos separadamente
    const { port, serverName, ...rest } = startupParams
    return Object.entries(rest)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n')
}

const ListInstanceCommand = async ({ args, startupParams, params }) => {
    const { serviceId } = args
    const ServiceOrchestratorCommand = MountServiceOrchestratorCommand({ startupParams, params })
    const instanceList = await ServiceOrchestratorCommand((API) => API.ListInstances({ serviceId }))

    const table = new Table({
        head: [
            'Status',
            'Instance ID',
            'Service ID',
            'Ports',
            'Network',
            'Startup Params'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    instanceList.forEach(instance => {
        const ports = (instance.ports || [])
            .map(p => `${p.hostPort}->${p.servicePort}`)
            .join(', ')
        const network = instance.networkmode || '-'
        const startup = formatStartupParams(instance.startupParams)

        table.push([
            instance.status,
            `[${instance.instanceId}]`,
            `[${instance.serviceId}]`,
            ports,
            network,
            startup
        ])
    })

    console.log(table.toString())
}

module.exports = ListInstanceCommand