const { literal } = require('sequelize')


const PACKAGE_ITEM_TYPE = ["app", "cli", "webapp", "webgui", "webservice", "service", "lib"]

const CreateMyWorkspaceDomainService = ({
    RepositoryModel,
    RepositoryItemModel,
    ServiceModel,
    ImageBuildHistoryModel,
    InstanceModel,
    ContainerModel,
    ContainerEventLogModel
}) => {

    const ListRepositories = (userId) => RepositoryModel.findAll({where: { userId }})

    const GetRepositoryByNamespace = (namespace) => RepositoryModel.findOne({ where: { namespace } })
    const GetRepositoryById = (id) => RepositoryModel.findOne({ where: { id } })

    const RegisterRepository = ({ repositoryNamespace , userId, repositoryCodePath }) => RepositoryModel.create({ namespace: repositoryNamespace, userId, repositoryCodePath})

    const ListItemByRepositoryId = (repositoryId) => RepositoryItemModel.findAll({ where: { repositoryId }, raw: true})


    const GetItemById = (id) => RepositoryItemModel.findOne({
        attributes: {
            include: [
                [literal('"Repository"."id"'), "repositoryId"],
                [literal('"Repository"."namespace"'), "repositoryNamespace"],
                [literal('"Repository"."repositoryCodePath"'), "repositoryCodePath"],
            ]
        },
        include: [{
            model: RepositoryModel,
            attributes: []
        }],
        where: { id }, 
        raw: true 
    })

    const ListPackageItemByUserId = async (userId) => {
        const items = await RepositoryItemModel.findAll({
             attributes: {
                include: [
                    [literal('"Repository"."id"'), "repositoryId"],
                    [literal('"Repository"."namespace"'), "repositoryNamespace"],
                    [literal('"Repository"."repositoryCodePath"'), "repositoryCodePath"],
                ]
            },
            include: [{
                model: RepositoryModel,
                where: { userId },
                attributes: []
            }],
            where: {
                itemType: PACKAGE_ITEM_TYPE
            },
            raw: true
        })

        return items
    }

    const GetPackageItemByPath = async ({ path, userId }) => {
        const item = await RepositoryItemModel.findOne({
            attributes: {
                include: [
                    [literal('"Repository"."repositoryCodePath"'), "repositoryCodePath"],
                    [literal('"Repository"."namespace"'), "repositoryNamespace"],
                ]
            },
            include: [{
                model: RepositoryModel,
                where: { userId },
                attributes: []
            }],
            where: {
                itemPath: path,
                itemType: PACKAGE_ITEM_TYPE
            },
            raw: true
        })
    
        return item
    }

    const GetPackageById = async (id) => {
        const item = await RepositoryItemModel.findOne({
            attributes: {
                include: [
                    [literal('"Repository"."repositoryCodePath"'), "repositoryCodePath"],
                    [literal('"Repository"."namespace"'), "repositoryNamespace"],
                ]
            },
            include: [{
                model: RepositoryModel,
                attributes: []
            }],
            where: {
                id,
                itemType: PACKAGE_ITEM_TYPE
            },
            raw: true
        })
    
        return item
    }
    
    const ListServicesByUserId = async (userId) => {
        const items = await ServiceModel.findAll({
            include: [
                {
                    model: RepositoryModel,
                    where: { userId },
                    attributes: ["id", "namespace"]
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
            raw: false
        })

        return items.map(item => item.get({ plain: true }))
    }

    const ListServices = async () => {
        const items = await ServiceModel.findAll({
            include: [
                {
                    model: RepositoryModel,
                    attributes: ["id", "namespace"]
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
            raw: false
        })
        return items.map(item => item.get({ plain: true }))
    }

    const GetServiceById = async (serviceId) => {
        const item = await ServiceModel.findOne({
            include: [
                {
                    model: RepositoryModel,
                    attributes: ["id", "namespace"]
                },
                {
                    model: RepositoryItemModel,
                    attributes: ["id", "itemName", "itemType", "itemPath"]
                }
            ],
            where: {
                id: serviceId
            },
            raw: false
        })

        return item.get({ plain: true })

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

    /*const NotifyContainerEvent = () => {

        ContainerStatusHistoryModel
    }*/
    

    const RegisterInstanceCreation = ({ serviceId, startupParams, ports, networkmode}) => 
            InstanceModel.create({ serviceId, startupParams, ports, networkmode })

    const RegisterTerminateInstance = async (instanceId) => 
        InstanceModel.update({ terminateDate: new Date() },{ where: { id: instanceId } }
)

    const ListImageBuildHistory = async (serviceId) => {
        const items = await ImageBuildHistoryModel.findAll({
            where: {
                serviceId
            }
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
        RegisterRepository,
        RegisterServiceProvisioning,
        RegisterInstanceCreation,
        RegisterTerminateInstance,
        RegisterBuildedImage,
        ListRepositories,
        GetRepository:{
            ByNamespace: GetRepositoryByNamespace,
            ById: GetRepositoryById
        },
        ListItemByRepositoryId,
        GetItemById,
        ListPackageItemByUserId,
        GetPackageById,
        GetPackageItemByPath,
        ListServices,
        ListServicesByUserId,
        GetServiceById,
        ListImageBuildHistory,
        ListInstancesByServiceId,
        ListContainersByServiceId,
        ListActiveInstancesByServiceId,
        GetLastInstanceByServiceId,
        GetContainerInfoByInstanceId,
        RegisterContainer
    }
}

module.exports = CreateMyWorkspaceDomainService