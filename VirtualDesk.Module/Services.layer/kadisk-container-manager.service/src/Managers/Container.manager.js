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

    const ListAllContainers = () => docker.listContainers({ all: true })

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

    return {
        ListAllContainers,
        BuildImageFromDockerfileString,
        CreateNewContainer
    }

}

module.exports = ContainerManager