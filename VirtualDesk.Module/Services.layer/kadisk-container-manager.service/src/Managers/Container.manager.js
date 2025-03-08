const Docker = require('dockerode')
const tarStream = require('tar-stream')



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

    const _EnsureImageExists = async (imageName) => {
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
    }


    const BuildImageFromDockerfileString = async ({
        dockerfileString, imageTag
    }) => {
        return new Promise((resolve, reject) => {
            const pack = tarStream.pack()
            pack.entry({ name: 'Dockerfile' }, dockerfileString)
            pack.finalize()

            docker.buildImage(pack, { t: imageTag }, (err, stream) => {
                if (err) return reject(err)
                stream.on('data', chunk => process.stdout.write(chunk))
                stream.on('end', resolve)
                stream.on('error', reject)
            })
        })
    }

    const CreateNewContainer = async ({
        imageName,
        containerName
    }) => {
        const container = await docker.createContainer({
            Image: imageName,
            name: containerName
        })

        return container
    }

    return {
        ListAllContainers,
        BuildImageFromDockerfileString,
        CreateNewContainer
    }

}

module.exports = ContainerManager