const { literal } = require('sequelize')


const PACKAGE_ITEM_TYPE = ["app", "cli", "webapp", "webgui", "webservice", "service", "lib"]

const CreateMyWorkspaceDomainService = ({
    RepositoryNamespaceModel,
    RepositoryImportedModel,
    RepositoryItemModel,
    ServiceModel,
    ImageBuildHistoryModel,
    InstanceModel,
    ContainerModel,
    ContainerEventLogModel
}) => {

    const ListRepositoryNamespace = (userId) => RepositoryNamespaceModel.findAll({where: { userId }})

    const GetRepositoryNamespaceId = async (namespace) => {
        const respositoryNamespaceData = await RepositoryNamespaceModel.findOne({ where: { namespace } })
        return respositoryNamespaceData?.id
    }

    const GetRepositoryImported = (id) => RepositoryImportedModel.findOne({ where: { id } })

    const RegisterRepositoryNamespace = ({ namespace , userId }) => 
        RepositoryNamespaceModel.create({ namespace, userId })

    const RegisterRepositoryImported = ({ namespaceId, repositoryCodePath }) => 
        RepositoryImportedModel.create({ namespaceId, repositoryCodePath })

    const ListItemByRepositoryId = (repositoryId) => RepositoryItemModel.findAll({ where: { repositoryId }, raw: true})

    const GetRepositoryNamespaceByRepositoryId = async (repositoryId) => {

        const repositoryData = await RepositoryImportedModel.findOne({
            attributes: {
                include: [
                    [literal('"RepositoryNamespace"."namespace"'), "repositoryNamespace"]
                ]
            },
            include: [{
                model: RepositoryNamespaceModel,
                attributes: []
            }],
            where: { id: repositoryId },
            raw: true
        })

        return repositoryData?.repositoryNamespace

    }

    const GetItemById = async (id) => {
        const item = await RepositoryItemModel.findOne({
            include: [{
                model: RepositoryImportedModel,
                attributes: ['repositoryCodePath'],
                include: [{
                    model: RepositoryNamespaceModel,
                    attributes: ['namespace']
                }]
            }],
            where: { id }, 
            raw: true 
        })

        return {
            ...item,
            repositoryCodePath: item['RepositoryImported.repositoryCodePath'],
            repositoryNamespace: item['RepositoryImported.RepositoryNamespace.namespace']
        }
    }

    const ListPackageItemByUserId = async (userId) => {
        const items = await RepositoryItemModel.findAll({
            include: [{
                model: RepositoryImportedModel,
                attributes: ['repositoryCodePath'],
                include: [{
                    model: RepositoryNamespaceModel,
                    attributes: ['namespace'],
                    where: { userId }
                }]
            }],
            where: {
                itemType: PACKAGE_ITEM_TYPE
            },
            raw: true
        })

        return items.map(item => ({
            ...item,
            repositoryCodePath: item['RepositoryImported.repositoryCodePath'],
            repositoryNamespace: item['RepositoryImported.RepositoryNamespace.namespace']
        }))
    }

    const GetPackageItemByPath = async ({ path, userId }) => {
        const item = await RepositoryItemModel.findOne({
            include: [{
                model: RepositoryImportedModel,
                attributes: ['repositoryCodePath'],
                include: [{
                    model: RepositoryNamespaceModel,
                    where: { userId },
                    attributes: ['namespace']
                }]
            }],
            where: {
                itemPath: path,
                itemType: PACKAGE_ITEM_TYPE
            },
            raw: true
        })
    
        return {
            ...item,
            repositoryCodePath: item['RepositoryImported.repositoryCodePath'],
            repositoryNamespace: item['RepositoryImported.RepositoryNamespace.namespace']
        }
    }

    const GetPackageById = async (id) => {
        const item = await RepositoryItemModel.findOne({
            include: [{
                model: RepositoryImportedModel,
                attributes: ['repositoryCodePath'],
                include: [{
                    model: RepositoryNamespaceModel,
                    attributes: ['namespace']
                }]
            }],
            where: {
                id,
                itemType: PACKAGE_ITEM_TYPE
            },
            raw: true
        })
    
        return {
            ...item,
            repositoryCodePath: item['RepositoryImported.repositoryCodePath'],
            repositoryNamespace: item['RepositoryImported.RepositoryNamespace.namespace']
        }
    }
    
    const ListServicesByUserId = async (userId) => {
        const items = await ServiceModel.findAll({
            include: [
                {
                    model: RepositoryImportedModel,
                    attributes: ["id"],
                    include: [
                        {
                            model: RepositoryNamespaceModel,
                            where: { userId },
                            attributes: ["id", "namespace"]
                        }
                    ]
                },
                {
                    model: RepositoryItemModel,
                    attributes: ["id", "itemName", "itemType", "itemPath"]
                },
                {
                    model: InstanceModel,
                    include: [{
                        model: ImageBuildHistoryModel,
                    }]
                }
            ],
            raw: true
        })
        return items
        .map( item => ({
            ...item,
            packageId: item['RepositoryItem.id'],
            packageName: item['RepositoryItem.itemName'],
            packageType: item['RepositoryItem.itemType'],
            repositoryId: item['RepositoryImported.id'],
            repositoryCodePath: item['RepositoryImported.repositoryCodePath'],
            repositoryNamespace: item['RepositoryImported.RepositoryNamespace.namespace']
        }))
    }

    const ListServiceIds = async () => {
        const items = await ServiceModel.findAll()
        return items?.map( item => item.id )
    }

    const GetServiceById = async (serviceId) => {
        const item = await ServiceModel.findOne({
            include: [
                {
                    model: RepositoryImportedModel,
                    attributes: ["id"],
                    include: [
                        {
                            model: RepositoryNamespaceModel,
                            attributes: ["id", "namespace"]
                        }
                    ]
                },
                {
                    model: RepositoryItemModel,
                    attributes: ["id", "itemName", "itemType", "itemPath"]
                }
            ],
            where: {
                id: serviceId
            },
            raw: true
        })
        
        return {
            ...item,
            packageId: item['RepositoryItem.id'],
            packageName: item['RepositoryItem.itemName'],
            packageType: item['RepositoryItem.itemType'],
            repositoryId: item['RepositoryImported.id'],
            repositoryCodePath: item['RepositoryImported.repositoryCodePath'],
            repositoryNamespace: item['RepositoryImported.RepositoryNamespace.namespace']
        }
    }


    const RegisterServiceProvisioning = ({ 
        serviceName,
        serviceDescription,
        originRepositoryId,
        packageId,
        instanceRepositoryCodePath
    }) => 
        ServiceModel
            .create({ 
                serviceName,
                serviceDescription,
                originRepositoryId,
                packageId,
                instanceRepositoryCodePath
            })

    const RegisterBuildedImage = ({
        instanceId,
        tag,
        hashId
    }) => ImageBuildHistoryModel
            .create({ 
                instanceId,
                tag,
                hashId,
            })

    const RegisterContainer = ({
            containerName,
            instanceId,
            buildId
        }) => ContainerModel
        .create({
            containerName,
            instanceId,
            buildId
        })

    const RegisterInstanceCreation = ({ serviceId, startupParams, ports, networkmode}) => 
            InstanceModel.create({ serviceId, startupParams, ports, networkmode })

    const RegisterTerminateInstance = async (instanceId) => 
        InstanceModel.update({ terminateDate: new Date() },{ where: { id: instanceId } })

    const ListImageBuildHistoryByServiceId = async (serviceId) => {
        const items = await ImageBuildHistoryModel.findAll({
            include: [{
                model: InstanceModel,
                where: { serviceId },
                attributes: []
            }]
        })
        return items.map(item => item.get({ plain: true }))
    }
    
    const ListInstancesByServiceId = async (serviceId) => {
        const items = await InstanceModel.findAll({
            where: {
                serviceId
            }
        })

        return items.map(item => item.get({ plain: true }))
    }

    const ListContainersByServiceId = async (serviceId) => {
        const items = await ContainerModel.findAll({
            include: [{
                model: InstanceModel,
                where: { serviceId },
                attributes: [] // Não traz os dados da instância, só filtra
            }]
        })
        return items.map(item => item.get({ plain: true }))
    }

    const ListActiveInstancesByServiceId = async (serviceId) => {
        const items = await InstanceModel.findAll({
            where: {
                serviceId,
                terminateDate: null
            }
        })

        return items.map(item => item.get({ plain: true }))
    }

    const GetContainerInfoByInstanceId = async (instanceId) => {
        const containerData = await ContainerModel
            .findOne({ where: { instanceId } })
        return containerData ? containerData.get({ plain: true }) : null
    }

    const GetLastInstanceByServiceId = async (serviceId) => {
        const instance = await InstanceModel.findOne({
            where: { 
                serviceId,
                terminateDate: null
            },
            order: [['createdAt', 'DESC']]
        })
        return instance ? instance.get({ plain: true }) : null
    }

    return {
        RegisterRepositoryNamespace,
        RegisterRepositoryImported,
        RegisterServiceProvisioning,
        RegisterInstanceCreation,
        RegisterTerminateInstance,
        RegisterBuildedImage,
        ListRepositoryNamespace,
        GetRepositoryNamespaceId,
        GetRepositoryNamespaceByRepositoryId,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetItemById,
        ListPackageItemByUserId,
        GetPackageById,
        GetPackageItemByPath,
        ListServiceIds,
        ListServicesByUserId,
        GetServiceById,
        ListImageBuildHistoryByServiceId,
        ListInstancesByServiceId,
        ListContainersByServiceId,
        ListActiveInstancesByServiceId,
        GetLastInstanceByServiceId,
        GetContainerInfoByInstanceId,
        RegisterContainer
    }
}

module.exports = CreateMyWorkspaceDomainService