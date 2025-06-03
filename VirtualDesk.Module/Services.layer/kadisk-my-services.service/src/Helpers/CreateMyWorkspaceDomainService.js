const { literal } = require('sequelize')


const PACKAGE_ITEM_TYPE = ["app", "cli", "webapp", "webgui", "webservice", "service", "lib"]

const CreateMyWorkspaceDomainService = ({
    RepositoryModel,
    RepositoryItemModel,
    ProvisionedServiceModel,
    ImageBuildHistoryModel,
    ServiceInstanceModel
}) => {

    const ListRepositories = (userId) => RepositoryModel.findAll({where: { userId }})

    const GetRepositoryByNamespace = (namespace) => RepositoryModel.findOne({ where: { namespace } })
    const GetRepositoryById = (id) => RepositoryModel.findOne({ where: { id } })

    const RegisterRepository = ({ repositoryNamespace , userId, repositoryCodePath }) => RepositoryModel.create({ namespace: repositoryNamespace, userId, repositoryCodePath})

    const ListItemByRepositoryId = (repositoryId) => RepositoryItemModel.findAll({ where: { repositoryId }, raw: true})
    const GetItemById = (id) => RepositoryItemModel.findOne({ where: { id } })

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

    const GetPackageItemById = async ({ id, userId }) => {
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
                id,
                itemType: PACKAGE_ITEM_TYPE
            },
            raw: true
        })
    
        return item
    }
    
    const ListProvisionedServices = async (userId) => {
        const items = await ProvisionedServiceModel.findAll({
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
                    model: ImageBuildHistoryModel,
                    include: [{
                        model: ServiceInstanceModel
                    }]
                }
            ],
            raw: false
        })

        return items.map(item => item.get({ plain: true }))
    }

    const GetServiceById = async ({serviceId, userId}) => {
        const item = await ProvisionedServiceModel.findOne({
            include: [
                {
                    model: RepositoryModel,
                    where: { userId },
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
        repositoryId,
        packageId
    }) => 
        ProvisionedServiceModel
            .create({ 
                serviceName,
                serviceDescription,
                repositoryId,
                packageId
            })

    const RegisterBuildedImage = ({
        serviceId,
        tag,
        hashId
    }) => ImageBuildHistoryModel
            .create({ 
                serviceId,
                tag,
                hashId,
            })
    

    const RegisterServiceInstance = ({
        containerName,
        buildId,
        serviceId
    }) => ServiceInstanceModel
            .create({
                containerName,
                buildId,
                serviceId
            })

    const ListImageBuildHistory = async (serviceId) => {
        const items = await ImageBuildHistoryModel.findAll({
            where: {
                serviceId
            }
        })

        return items.map(item => item.get({ plain: true }))
    }
    
    const GetInstancesByServiceId = async (serviceId) => {
        const items = await ServiceInstanceModel.findAll({
            where: {
                serviceId
            }
        })

        return items.map(item => item.get({ plain: true }))
    }

    return {
        RegisterRepository,
        RegisterServiceProvisioning,
        RegisterServiceInstance,
        RegisterBuildedImage,
        ListRepositories,
        GetRepository:{
            ByNamespace: GetRepositoryByNamespace,
            ById: GetRepositoryById
        },
        ListItemByRepositoryId,
        GetItemById,
        ListPackageItemByUserId,
        GetPackageItemById,
        GetPackageItemByPath,
        ListProvisionedServices,
        GetServiceById,
        ListImageBuildHistory,
        GetInstancesByServiceId
    }
}

module.exports = CreateMyWorkspaceDomainService