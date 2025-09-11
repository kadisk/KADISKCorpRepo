const MountServiceOrchestratorCommand = require('../Helpers/MountServiceOrchestratorCommand')

const StartServiceCommand = async ({ args, startupParams, params }) => {
    const { serviceId } = args
    const ServiceOrchestratorCommand = MountServiceOrchestratorCommand({ startupParams, params })
    await ServiceOrchestratorCommand((API) => API.StartService({ serviceId }))
    
}

module.exports = StartServiceCommand
