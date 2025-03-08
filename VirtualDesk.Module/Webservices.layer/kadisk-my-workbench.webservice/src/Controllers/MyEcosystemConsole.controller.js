


const STANDARD_ECOSYSTEM_META_PLATFORM_DOCKERFILE_CONTENT = `
FROM node:22

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
RUN wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 \
        -O mywizard \
    && chmod +x mywizard

RUN ./mywizard install release-standard

ENV PATH="/home/myecosystem/EcosystemData/executables:\"\${PATH}\""

CMD ["/bin/bash"]
`

const MyEcosystemConsoleController = (params) => {


    const {
        containerManagerService
    } = params

    const { BuildImageFromDockerfileString } = containerManagerService

    const ActivateMyEcosystemInstance = async () => {

        await BuildImageFromDockerfileString({
            dockerfileString: STANDARD_ECOSYSTEM_META_PLATFORM_DOCKERFILE_CONTENT, 
            imageTag: "myecosystem:latest"
        })

        // Subir uma noma instancia


    }
    
    const controllerServiceObject = {
        controllerName : "MyEcosystemConsoleController",
        ActivateMyEcosystemInstance
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyEcosystemConsoleController