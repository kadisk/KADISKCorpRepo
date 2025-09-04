const { join, resolve} = require("path")

const PrepareDirPath = require("./PrepareDirPath")
const CopyDirRepository = require("./CopyDirRepository")
const GetContextTarStream = require("./GetContextTarStream")

const CreateServiceHandler = ({
    absolutInstanceDataDirPath,
    MyWorkspaceDomainService,
    BuildImageFromDockerfileString,
    CreateNewContainer
}) => {


    const _CreateAndStartContainer = async ({
        containerName,
        imageName,
        ports = [],
        networkmode
    }) => {

        const _RemapPort = (ports) => ports.map(({ servicePort, hostPort }) => ({ containerPort:servicePort, hostPort }))

        const container = await CreateNewContainer({
            imageName,
            containerName,
            ports: _RemapPort(ports),
            networkmode
        })

        await container.start()
        console.log(`[INFO] Container '${containerName}' iniciado com a imagem '${imageName}'`)

    }

    const _MountPathInstanceRepositoriesSourceCodeDirPath = ({ username, repositoryNamespace, serviceDataDirName }) => {
        const repositoriesCodePath = resolve(absolutInstanceDataDirPath, username, serviceDataDirName, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const CreateService = async ({
        username,
        packageId,
        serviceName,
        serviceDescription
    }) => {
        const packageData = await MyWorkspaceDomainService.GetPackageById(packageId)
        const { repositoryCodePath } = packageData

        const instanceRepositoryCodePath = _MountPathInstanceRepositoriesSourceCodeDirPath({
            username, 
            repositoryNamespace: packageData.repositoryNamespace,
            serviceDataDirName:serviceName
        })

        const serviceData = await MyWorkspaceDomainService
            .RegisterServiceProvisioning({
                serviceName,
                serviceDescription,
                originRepositoryId: packageData.repositoryId,
                packageId: packageData.packageId,
                instanceRepositoryCodePath
        })

        await CopyDirRepository(repositoryCodePath, instanceRepositoryCodePath)

        return serviceData

    }


    const CreateInstance = async({
        serviceId,
        startupParams,
        ports,
        networkmode
    }) => {

        const instanceData = await MyWorkspaceDomainService
            .RegisterInstanceCreation({
                serviceId,
                startupParams,
                ports,
                networkmode
            })

        return instanceData
    }


    const BuildImage = async ({
        imageTagName,
        repositoryCodePath,
        repositoryNamespace,
        packagePath,
        instanceId,
        startupParams
    }) => {

        const buildargs = {
            REPOSITORY_NAMESPACE: repositoryNamespace
        }

        const packageAbsolutPath = join(repositoryCodePath, packagePath)

        const contextTarStream = GetContextTarStream({
            repositoryPathForCopy: repositoryCodePath,
            packagePathForCopy: packageAbsolutPath,
            startupParams
        })
        
        const _handleData = chunk => {
            try {
                const lines = chunk.toString().split('\n').filter(Boolean)
        
                for (const line of lines) {
                    const parsed = JSON.parse(line)
        
                    if (parsed.stream) {
                        console.log(parsed.stream)
                    } else if (parsed.status) {
                        console.log(`[STATUS] ${parsed.status}`)
                    } else if (parsed.error) {
                        console.log(parsed.error)
                    } else {
                        console.log(`[OTHER] ${line}`)
                    }
                }
        
            } catch (err) {
                console.error('Failed to parse Docker output chunk:', chunk.toString())
            }
        }
        
        const imageInfo = await BuildImageFromDockerfileString({
            buildargs,
            contextTarStream,
            imageTagName,
            onData: _handleData
        })

        const buildData = await MyWorkspaceDomainService
            .RegisterBuildedImage({
                instanceId,
                tag: imageTagName,
                hashId: imageInfo.Id, 
            })


        return buildData
    }

    const CreateContainer = async ({
        containerName,
        instanceId,
        buildId,
        imageName,
        ports,
        networkmode
    }) => {

        const containerData = await MyWorkspaceDomainService
            .RegisterContainer({
                containerName,
                instanceId,
                buildId
            })

        await _CreateAndStartContainer({ containerName, imageName, ports, networkmode })


        return containerData
    }

    return {
        CreateService,
        CreateInstance,
        BuildImage,
        CreateContainer
    }
}

module.exports = CreateServiceHandler