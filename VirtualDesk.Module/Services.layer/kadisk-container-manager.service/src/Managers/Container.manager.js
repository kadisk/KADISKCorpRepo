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

    const ListAllContainers = async () => {
        return await docker.listContainers({ all: true })
    }

    _Start()

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

                stream.on('end', () => resolve())

                stream.on('error', error => reject(error))
            })
        })
    }

    return {
        ListAllContainers,
        BuildImageFromDockerfileString
    }

}

module.exports = ContainerManager