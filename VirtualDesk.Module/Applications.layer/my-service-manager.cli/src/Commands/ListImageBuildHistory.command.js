const Table = require('cli-table')
const MountServiceOrchestratorCommand = require('../Helpers/MountServiceOrchestratorCommand')

const ListImageBuildHistoryCommand = async ({ args, startupParams, params }) => {
    const { serviceId } = args
    const ServiceOrchestratorCommand = MountServiceOrchestratorCommand({ startupParams, params })
    const buildHistory = await ServiceOrchestratorCommand((API) => API.ListImageBuildHistory({ serviceId }))

    const table = new Table({
        head: [
            'Build ID',
            'Status',
            'Image Tag / Hash ID',
            'Instance ID',
            'Service ID'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    buildHistory.forEach(build => {
        table.push([
            build.buildId || '-',
            build.status || '-',
            `${build.tag || '-'}\n${build.hashId || '-'}`,
            build.instanceId || '-',
            build.serviceId || '-'
        ])
    })

    console.log(table.toString())
}

module.exports = ListImageBuildHistoryCommand