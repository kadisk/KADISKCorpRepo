FROM node:22

ARG REPOSITORY_NAMESPACE

ARG REPOSITORY_CONTEXT_PATH=/context_data/repository
ARG STARTUP_JSON=/context_data/startup-params.json
ARG PACKAGE_PATH=/context_data/package

ARG USERNAME=myecosystem
ARG HOME_DIR_PATH=/home/${USERNAME}
ARG ECOSYSTEM_DATA_PATH=${HOME_DIR_PATH}/EcosystemData
ARG NODEJS_DEPS_PATH=${ECOSYSTEM_DATA_PATH}/npm-dependencies
ARG ECOSYSTEM_DEFAULT=${ECOSYSTEM_DATA_PATH}/config-files/ecosystem-defaults.json

RUN apt-get update && apt-get install -y sudo wget git \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash ${USERNAME} \
    && usermod -aG sudo ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USERNAME}
WORKDIR ${HOME_DIR_PATH}

ADD context_data /context_data

RUN git clone https://github.com/Meta-Platform/meta-platform-package-executor-command-line.git package-executor \
    && cd package-executor \
    && npm install \
    && sudo npm link

WORKDIR ${HOME_DIR_PATH}
RUN wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 -O mywizard \
    && chmod +x mywizard

RUN ./mywizard install release-standard

ENV PATH="${HOME_DIR_PATH}/EcosystemData/executables:${PATH}"

RUN repo register source ${REPOSITORY_NAMESPACE} LOCAL_FS --localPath ${REPOSITORY_CONTEXT_PATH}
RUN repo install ${REPOSITORY_NAMESPACE} LOCAL_FS

ENV PACKAGE_PATH=${PACKAGE_PATH}
ENV STARTUP_JSON=${STARTUP_JSON}
ENV ECOSYSTEM_DEFAULT=${ECOSYSTEM_DEFAULT}
ENV ECOSYSTEM_DATA_PATH=${ECOSYSTEM_DATA_PATH}
ENV NODEJS_DEPS_PATH=${NODEJS_DEPS_PATH}

CMD ["sh", "-c", "pkg-exec --package $PACKAGE_PATH --startupJson $STARTUP_JSON --ecosystemDefault $ECOSYSTEM_DEFAULT --ecosystemData $ECOSYSTEM_DATA_PATH --nodejsProjectDependencies $NODEJS_DEPS_PATH --verbose"]