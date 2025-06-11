const { join, resolve} = require("path")
const os = require('os')
const fs = require('fs')
const path = require('path')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializePersistentStoreManager = require("../Helpers/InitializePersistentStoreManager")
const PrepareDirPath                   = require("../Helpers/PrepareDirPath")
const CreateItemIndexer                = require("../Helpers/CreateItemIndexer")
const CreateMyWorkspaceDomainService   = require("../Helpers/CreateMyWorkspaceDomainService")
const GetContextTarStream              = require("../Helpers/GetContextTarStream")

const CopyDirRepository = async (src, dest) => {
    await fs.promises.mkdir(dest, { recursive: true })
    const entries = await fs.promises.readdir(src, { withFileTypes: true })

    for (let entry of entries) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)

        if (entry.isDirectory()) {
            await CopyDirRepository(srcPath, destPath)
        } else {
            await fs.promises.copyFile(srcPath, destPath)
        }
    }
}

const MyServicesManager = (params) => {

    const {
        onReady,
        storageFilePath,
        importedRepositoriesSourceCodeDirPath,
        instanceDataDirPath,
        ecosystemDefaultsFileRelativePath,
        ecosystemdataHandlerService,
        containerManagerService,
        extractTarGzLib,
        loadMetatadaDirLib,
        jsonFileUtilitiesLib
    } = params

    const { 
        BuildImageFromDockerfileString,
        CreateNewContainer,
        InspectContainer
    } = containerManagerService

    const ExtractTarGz = extractTarGzLib.require("ExtractTarGz")
    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")
    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const absolutStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)
    const absolutImportedRepositoriesSourceCodeDirPath = ConvertPathToAbsolutPath(importedRepositoriesSourceCodeDirPath)
    const absolutInstanceDataDirPath     = ConvertPathToAbsolutPath(instanceDataDirPath)

    const PersistentStoreManager = InitializePersistentStoreManager(absolutStorageFilePath)
    const {
        Repository         : RepositoryModel,
        RepositoryItem     : RepositoryItemModel,
        Service : ServiceModel,
        ImageBuildHistory  : ImageBuildHistoryModel,
        Instance    : InstanceModel
    } = PersistentStoreManager.models

    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
        RepositoryModel, 
        RepositoryItemModel, 
        ServiceModel,
        ImageBuildHistoryModel,
        InstanceModel
    })


    const _MountPathImportedRepositoriesSourceCodeDirPath = ({username, repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutImportedRepositoriesSourceCodeDirPath, username, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const _MountPathInstanceRepositoriesSourceCodeDirPath = ({username, repositoryNamespace, serviceDataDirName}) => {
        const repositoriesCodePath = resolve(absolutInstanceDataDirPath, username, serviceDataDirName, repositoryNamespace)
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const _Start = async () => {
        await PersistentStoreManager.ConnectAndSync()
        onReady()
    }

    _Start()

    const SaveUploadedRepository = async ({ repositoryNamespace, userId, username , repositoryFilePath }) => {
        const repositoriesCodePath = _MountPathImportedRepositoriesSourceCodeDirPath({username, repositoryNamespace})

        const newRepositoryCodePath = await ExtractTarGz(repositoryFilePath, repositoriesCodePath)
        const repoData = await RecordNewRepository({ userId, repositoryNamespace, repositoryCodePath: newRepositoryCodePath})

        ItemIndexer.IndexRepository({
            repositoryId: repoData.id,
            repositoryCodePath: newRepositoryCodePath
        })

        return repoData
    }

    const RecordNewRepository = async ({userId, repositoryCodePath, repositoryNamespace}) => {
        const existingNamespace = await MyWorkspaceDomainService.GetRepository.ByNamespace(repositoryNamespace)

        if (existingNamespace) 
            throw new Error('Repository Namespace already exists')

        const newRepository = await MyWorkspaceDomainService
            .RegisterRepository({ repositoryNamespace , userId, repositoryCodePath })
        return newRepository
    }

    const GetStatus = async (userId) => {
        const repositoryCount = await RepositoryModel.count({ where: { userId } })
    
        if (repositoryCount > 0) {
            return "READY"
        } else {
            return "NO_REPOSITORIES"
        }
    }
    
    const GetMetadataByPackageId = async (packageId) => { 
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const packageData = await MyWorkspaceDomainService.GetItemById(packageId)

        const packageAbsolutPath = join(packageData.repositoryCodePath, packageData.itemPath)
        console.log(`[INFO] Loading metadata for package item at path: ${packageAbsolutPath}`)

        const metadata = await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
            path: packageAbsolutPath
        })

        return {
            schema : metadata["startup-params-schema"],
            value  : metadata["startup-params"],
        }

    }

    const ListBootablePackages = async ({ userId, username }) => {

        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)
        const packageItems  = await MyWorkspaceDomainService.ListPackageItemByUserId(userId)
        console.log(`[INFO] Found ${packageItems.length} package items for user ${username} userId ${userId}`)

        const packageItemsWithMetadataPromises = packageItems
            .map(async (packageItem) => {

                const packageAbsolutPath = join(packageItem.repositoryCodePath, packageItem.itemPath)
                console.log(`[INFO] Loading metadata for package item at path: ${packageAbsolutPath}`)

                const metadata = await LoadMetadataDir({
                    metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
                    path: packageAbsolutPath
                })

                return {
                    ...packageItem,
                    metadata
                }
            })


        const allPackageItems = await Promise.all(packageItemsWithMetadataPromises)
        const bootablePacakgeItems = allPackageItems.filter(({metadata}) => metadata && metadata.boot)
        return bootablePacakgeItems
        
    }

    const ListRepositories = async (userId) => {
        const repositoriesData  = await MyWorkspaceDomainService.ListRepositories(userId)
        
        const repositories = repositoriesData
            .map((repositoryData) => {
                const { id, namespace } = repositoryData
                return { id, namespace } 
            })

        return repositories
    }

    const BuildImage = async ({
        username,
        serviceData,
        packageData,
        startupParams
    }) => {
        const imageTagName = `ecosystem_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}:${serviceData.serviceName}-${serviceData.id}`.toLowerCase()

        const buildargs = {
            REPOSITORY_NAMESPACE: packageData.repositoryNamespace,

        }

        const packageAbsolutPath = join(serviceData.instanceRepositoryCodePath, packageData.itemPath)

        const contextTarStream = GetContextTarStream({
            repositoryPathForCopy: serviceData.instanceRepositoryCodePath,
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
                serviceId: serviceData.id,
                tag: imageTagName,
                hashId: imageInfo.Id
            })


        return buildData
    }

    const StartNewContainer = async ({
        username,
        serviceData,
        packageData,
        buildData,
        ports = []
    }) => {
        const containerName = `container_${username}_${packageData.repositoryNamespace}__${packageData.itemName}-${packageData.itemType}--${serviceData.serviceName}--${buildData.id}`

        const _RemapPort = (ports) => ports.map(({ servicePort, hostPort }) => ({ containerPort:servicePort, hostPort }))

        const container = await CreateNewContainer({
            imageName: buildData.tag,
            containerName,
            ports: _RemapPort(ports)
        })

        

        await container.start()
        console.log(`[INFO] Container '${containerName}' iniciado com a imagem '${buildData.tag}'`)

    }


    const CreateInstance = async({
        username,
        serviceData,
        packageData,
        startupParams,
        ports
    }) => {

        //é preciso atualizar as instances para que era tenha um registro de mudança de status
        //o ImageBuildHistory precisa estar associado a instancia
        //criar ContainerStatusHistory

        const instanceData = await MyWorkspaceDomainService
            .RegisterInstance(serviceData.id)

        const buildData = await BuildImage({
            username,
            serviceData,
            packageData,
            startupParams
        })
        
        await StartNewContainer({
            username,
            serviceData,
            packageData,
            buildData,
            ports
        })

    }

    const ProvisionService = async ({
        userId, 
        username,
        packageId,
        serviceName,
        serviceDescription,
        startupParams,
        ports = []
    }) => {

        const packageData = await MyWorkspaceDomainService.GetPackageItemById({ id: packageId, userId })
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
                packageId: packageData.id,
                instanceRepositoryCodePath
        })


        await CopyDirRepository(repositoryCodePath, instanceRepositoryCodePath)

        await CreateInstance({
            username,
            serviceData,
            packageData,
            startupParams,
            ports
        })
        
    }

    const ListProvisionedServices = async (userId) => {
        const provisionedServices = await MyWorkspaceDomainService.ListProvisionedServices(userId)
    
        const provisionedServicesWithMetadataPromises = provisionedServices
            .map(async (provisionedService) => {
                return {
                    service:provisionedService,
                    repository: provisionedService.Repository,
                    repositoryItem: provisionedService.RepositoryItem,
                    builds: provisionedService.ImageBuildHistories,
                    instances: provisionedService.ImageBuildHistories?.flatMap(build => build.ServiceInstances)
                }
            })
    
        const provisionedServicesRawData = await Promise.all(provisionedServicesWithMetadataPromises)

        const provisionedServicesDataPromises = provisionedServicesRawData
        .map(async (provisionedService) => {
            const { 
                repository,
                repositoryItem,
                service,
                builds,
                instances
            } = provisionedService

            const lastBuild = builds.at(-1)
            const lastInstance = instances.at(-1)

            const inpectContainerData = await InspectContainer(lastInstance.containerName)

            return {
                serviceId           : service.id,
                serviceName         : service.serviceName,
                appType             : service.appType,
                packageId           : service.packageId,
                repositoryId        : repository.id,
                repositoryNamespace : repository.namespace,
                packageId           : repositoryItem.id,
                packageName         : repositoryItem.itemName,
                packageType         : repositoryItem.itemType,
                instanceId          : lastInstance.id,
                containerName       : lastInstance.containerName,
                buildId             : lastBuild.id,
                imageTagName        : lastBuild.tag,
                hashId              : lastBuild.hashId,
                containerIPAddress  : inpectContainerData?.NetworkSettings.IPAddress,
                containerStatus     : inpectContainerData?.State.Status,
                containerPorts      : inpectContainerData?.NetworkSettings.Ports
            }
        })

        const provisionedServicesData = await Promise.all(provisionedServicesDataPromises)

        return provisionedServicesData
    }


    const GetServiceData = async ({ serviceId, userId }) => {
            
        const serviceData = await MyWorkspaceDomainService.GetServiceById({serviceId, userId})
        
        const { 
            Repository, 
            RepositoryItem,
        } = serviceData

        return {
            serviceId           : serviceData.id,
            serviceName         : serviceData.serviceName,
            appType             : serviceData.appType,
            repositoryId        : Repository.id,
            repositoryNamespace : Repository.namespace,
            packageId           : RepositoryItem.id,
            packageName         : RepositoryItem.itemName,
            packageType         : RepositoryItem.itemType,
        }

    }

    return {
        SaveUploadedRepository,
        GetStatus,
        ListBootablePackages,
        ListRepositories,
        ProvisionService,
        ListProvisionedServices,
        GetServiceData,
        ListImageBuildHistory: MyWorkspaceDomainService.ListImageBuildHistory,
        GetInstancesByServiceId: MyWorkspaceDomainService.GetInstancesByServiceId,
        GetMetadataByPackageId
    }

}

module.exports = MyServicesManager