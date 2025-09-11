
const MountServiceOrchestratorCommand = require('../Helpers/MountServiceOrchestratorCommand')

const StopServiceCommand = async ({ args, startupParams, params }) => {
    const { serviceId } = args
    const ServiceOrchestratorCommand = MountServiceOrchestratorCommand({ startupParams, params })
    await ServiceOrchestratorCommand((API) => API.StopService({ serviceId }))
}

module.exports = StopServiceCommand
