const Docker = require('dockerode')

const ContainerManager = (params) => {

    const docker = new Docker({ socketPath: '/var/run/docker.sock' })

    const {
        onReady
    } = params

    const _Start = async () => {
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

    /*const _EnsureImageExists = async (imageName) => {
        try {
            await docker.getImage(imageName).inspect()
        } catch (err) {
            await new Promise((resolve, reject) => {
                docker.pull(imageName, (error, stream) => {
                    if (error) return reject(error)
                    stream.on('data', chunk => process.stdout.write(chunk))
                    stream.on('end', resolve)
                    stream.on('error', reject)
                })
            })
        }
    }*/


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
        containerName
    }) => {
        return docker.createContainer({
            Image: imageName,
            name: containerName
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
            console.error(`Error inspecting container ${containerIdOrName}:`, error)
            throw error
        }
    }

    return {
        StartContainer,
        StopContainer,
        RemoveContainer,
        ListAllContainers,
        BuildImageFromDockerfileString,
        CreateNewContainer,
        InspectContainer
    }

}

module.exports = ContainerManager