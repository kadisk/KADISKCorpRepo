
const tarStream = require('tar-stream')

const GetDockerfileContent = () => {
    return `
    FROM node:22
    
    ARG REPOSITORY_PATH
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
    
    COPY \${REPOSITORY_PATH} \${FIXED_PATH}
    
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

    const GetContextTarStream = () => {
        const contextTarStream = tarStream.pack()
        contextTarStream.entry({ name: 'Dockerfile' }, GetDockerfileContent())
        contextTarStream.finalize()

        return contextTarStream
    }

    const ProvisionService = async (packageId, { authenticationData }) => {
        
        const { userId, username } = authenticationData
    
        const packageData = await myServicesManagerService.GetPackage({ id: packageId, userId })
        
        const { repositoryNamespace, itemName, itemType } = packageData
        
        const imageTagName = `ecosystem:${username}_${repositoryNamespace}__${itemName}-${itemType}`
        
        console.log(imageTagName)
        
        console.log(packageData)
        
        const contextTarStream = GetContextTarStream()
       
        const _handleData = chunk => process.stdout.write(chunk)
        
        const buildargs = {
            REPOSITORY_PATH: packageData.repositoryCodePath,
            REPOSITORY_NAMESPACE: packageData.repositoryNamespace,
            EXECUTABLE_NAME: ""

        }

        /*await BuildImageFromDockerfileString({
            buildargs,
            contextTarStream,
            imageTagName,
            onData: _handleData
        })*/

        /*

        console.log("ProvisionService")*/
    }

    const controllerServiceObject = {
        controllerName: "ServiceProvisioningController",
        ListBootablePackages,
        ProvisionService
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceProvisioningController