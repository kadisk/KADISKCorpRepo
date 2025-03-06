const Docker = require('dockerode')

const ContainerManager = (params) => {

    const docker = new Docker({ socketPath: '/var/run/docker.sock' })

    const {
        onReady
    } = params

    const _Start = async () => {
        onReady()
    }

    const ListAllContainers = async () => {
        return await docker.listContainers({ all: true })
    }

    _Start()

    return {
        ListAllContainers
    }

}

module.exports = ContainerManager