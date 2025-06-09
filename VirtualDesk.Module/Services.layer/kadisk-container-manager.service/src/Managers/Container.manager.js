const Docker = require('dockerode')
const EventEmitter = require('node:events')

const ContainerManager = (params) => {

    const docker = new Docker({ socketPath: '/var/run/docker.sock' })

    const eventEmitter = new EventEmitter()

    const {
        onReady
    } = params

    const _Start = async () => {

        docker.getEvents({}, (err, stream) => {
            
            if (err) {
                console.error(err)
                return
            }

            stream.on('data', (chunk) => {
                try {
                    const event = JSON.parse(chunk.toString())
                    //console.log('Evento do Docker:', event)
                } catch (parseErr) {
                   // console.error(parseErr)
                }
            })

            stream.on('error', (err) => {
               // console.error(err)
            })

            stream.on('end', () => {
                console.log('Stream de eventos encerrado.')
            })
        })

        onReady()
    }

    _Start()

    const ListAllContainers = async () => {
        try {

            const containers = await docker.listContainers({ all: true })
            
            const detailedContainers = await Promise.all(
                containers.map(async (containerInfo) => {
                    const container = docker.getContainer(containerInfo.Id)
                    const inspectData = await container.inspect()
                    
                    return inspectData
                })
            )
            
            return detailedContainers
        } catch (error) {
            console.error('Error listing containers with details:', error)
            throw error
        }

    }

    const ListAllImages = async () => {
        try {
            const images = await docker.listImages()
            return images
        }
        catch (error) {
            console.error('Error listing images:', error)
            throw error
        }

    }
    const ListAllNetworks = async () => {
        try {
            const networks = await docker.listNetworks()
            return networks
        }
        catch (error) {
            console.error('Error listing networks:', error)
            throw error
        }

    }

    const BuildImageFromDockerfileString = async ({
        buildargs,
        contextTarStream, imageTagName, onData
    }) => {
        return new Promise((resolve, reject) => {
            
            docker.buildImage(contextTarStream, { t: imageTagName, buildargs }, (err, stream) => {
                if (err) return reject(err)
                stream.on('data', onData)
                stream.on('end', async () => {
                    try {
                        const image = docker.getImage(imageTagName)
                        const imageInfo = await image.inspect()
                        resolve(imageInfo)
                    } catch (inspectErr) {
                        reject(inspectErr)
                    }
                })
                stream.on('error', reject)
            })
        })
    }

    const CreateNewContainer = ({
        imageName,
        containerName,
        ports = []
    }) => {

        const portBindings = {}
        const exposedPorts = {}

        ports.forEach(({ containerPort, hostPort }) => {
            const containerPortKey = `${containerPort}/tcp`
            exposedPorts[containerPortKey] = {}
            portBindings[containerPortKey] = [
                {
                    HostPort: hostPort.toString()
                }
            ]
        })

        return docker.createContainer({
            Image: imageName,
            name: containerName,
            ExposedPorts: exposedPorts,
            HostConfig: {
                PortBindings: portBindings
            }
        })
    }

    const RemoveContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            await container.remove({ 
                force: false, 
                v: false 
            })
            return { success: true, message: `Container ${containerIdOrName} removed successfully` }
        } catch (error) {
            console.error(`Error removing container ${containerIdOrName}:`, error)
            throw error
        }
    }

    const StartContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            await container.start()
            return { success: true, message: `Container ${containerIdOrName} started successfully` }
        } catch (error) {
            console.error(`Error starting container ${containerIdOrName}:`, error)
            throw error
        }
    }
    
    const StopContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            await container.stop()
            return { success: true, message: `Container ${containerIdOrName} stopped successfully` }
        } catch (error) {
            console.error(`Error stopping container ${containerIdOrName}:`, error)
            throw error
        }
    }

    const InspectContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            const containerInfo = await container.inspect()
            return containerInfo
        } catch (error) {
            console.error(error)
            return null
        }
    }


    const RegisterDockerEventListener = (f) => 
        eventEmitter.on(EVENT, (eventData) => f(eventData))

    return {
        StartContainer,
        StopContainer,
        RemoveContainer,
        ListAllContainers,
        BuildImageFromDockerfileString,
        CreateNewContainer,
        InspectContainer,
        ListAllImages,
        ListAllNetworks,
        RegisterDockerEventListener
    }

}

module.exports = ContainerManager