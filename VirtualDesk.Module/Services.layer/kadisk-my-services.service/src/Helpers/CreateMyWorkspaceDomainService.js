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
            include: [{
                model: RepositoryModel,
                where: { userId },
                attributes: ["id", "namespace"]
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
                }
            ],
            raw: true
        })

        return items
    }

    const RegisterServiceProvisioning = ({ 
        executableName,
        appType,
        repositoryId,
        packageId
    }) => 
        ProvisionedServiceModel
            .create({ 
                executableName,
                appType,
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
        ListProvisionedServices
    }
}

module.exports = CreateMyWorkspaceDomainService