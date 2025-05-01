const { join } = require('path')
const tarStream = require('tar-stream')
const fs = require('fs')

const GetDockerfileContent = () => {
    return `
    FROM node:22
    
    ARG REPOSITORY_NAMESPACE
    ARG EXECUTABLE_NAME
    ARG FIXED_PATH=/tmp/repository

    RUN apt-get update && apt-get install -y sudo wget \
        && rm -rf /var/lib/apt/lists/*
    
    RUN useradd -ms /bin/bash myecosystem
    RUN usermod -aG sudo myecosystem
    RUN echo "myecosystem ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
    USER myecosystem
    
    WORKDIR /home/myecosystem
    
    RUN git clone https://github.com/Meta-Platform/meta-platform-package-executor-command-line.git package-executor
    RUN cd package-executor && npm install && sudo npm link
    
    WORKDIR /home/myecosystem
    RUN wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 -O mywizard && chmod +x mywizard
    
    RUN ./mywizard install release-standard
    
    ENV PATH="/home/myecosystem/EcosystemData/executables:\"\${PATH}\""
    
    COPY repository_copied \${FIXED_PATH}
    
    RUN repo register source \${REPOSITORY_NAMESPACE} LOCAL_FS --localPath \${FIXED_PATH}
    RUN repo install \${REPOSITORY_NAMESPACE} LOCAL_FS --executables "\${EXECUTABLE_NAME}"
    
    CMD ["\${EXECUTABLE_NAME}"]
`
}

const ServiceProvisioningController = (params) => {

    const { myServicesManagerService, containerManagerService } = params

    const { 
        BuildImageFromDockerfileString,
        CreateNewContainer
    } = containerManagerService

    const ListBootablePackages = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return myServicesManagerService
            .ListBootablePackages({ userId, username })
    }

    const ListApplications = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return myServicesManagerService
            .ListApplications(userId)
    }

    const GetContextTarStream = (repositoryPath) => {

        const contextTarStream = tarStream.pack()
        contextTarStream.entry({ name: 'Dockerfile' }, GetDockerfileContent())

        const _addFiles = (dirPath, basePath = '') => {
            const items = fs.readdirSync(dirPath)
            for (const item of items) {
                if (item === 'node_modules' || item === '.git') continue
    
                const fullPath = join(dirPath, item)
                const entryPath = join('repository_copied', basePath, item)
                const stats = fs.statSync(fullPath)
    
                if (stats.isDirectory()) {
                    _addFiles(fullPath, join(basePath, item))
                } else if (stats.isFile()) {
                    const content = fs.readFileSync(fullPath)
                    contextTarStream.entry({ name: entryPath }, content)
                }
            }
        }

        _addFiles(repositoryPath)
        contextTarStream.finalize()

        return contextTarStream
    }

    const ProvisionServiceFromApplication = async ({ executableName, repositoryId, packagePath }, { authenticationData }) => {  
        const { userId, username } = authenticationData
        
        const repositoryData = await myServicesManagerService.GetRepository.ById(repositoryId)
        const itemPath = join(repositoryData.repositoryCodePath, packagePath)
        const packageData = await myServicesManagerService.GetPackageByPath({ path: itemPath, userId })
        const imageTagName = `ecosystem:${username}_${repositoryData.namespace}__${packageData.itemName}-${packageData.itemType}--${executableName}`

        const buildargs = {
            REPOSITORY_NAMESPACE: repositoryData.namespace,
            EXECUTABLE_NAME: executableName

        }

        const contextTarStream = GetContextTarStream(repositoryData.repositoryCodePath)
        
        const _handleData = chunk => {
            try {
                const lines = chunk.toString().split('\n').filter(Boolean)
        
                for (const line of lines) {
                    const parsed = JSON.parse(line)
        
                    if (parsed.stream) {
                        process.stdout.write(parsed.stream)
                    } else if (parsed.status) {
                        console.log(`[STATUS] ${parsed.status}`)
                    } else if (parsed.error) {
                        process.stderr.write(parsed.error)
                    } else {
                        console.log(`[OTHER] ${line}`)
                    }
                }
        
            } catch (err) {
                console.error('Failed to parse Docker output chunk:', chunk.toString())
            }
        }

        
        await BuildImageFromDockerfileString({
            buildargs,
            contextTarStream,
            imageTagName,
            onData: _handleData
        })

    }

    const ProvisionServiceFromPackage = async (packageId, { authenticationData }) => {
        
    }

    const controllerServiceObject = {
        controllerName: "ServiceProvisioningController",
        ListBootablePackages,
        ProvisionServiceFromPackage,
        ProvisionServiceFromApplication,
        ListApplications
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceProvisioningController