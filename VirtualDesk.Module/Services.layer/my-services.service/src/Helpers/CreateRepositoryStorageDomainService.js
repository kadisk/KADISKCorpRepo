const { literal, Op } = require('sequelize')

const PACKAGE_ITEM_TYPE = ["app", "cli", "webapp", "webgui", "webservice", "service", "lib"]

const CreateRepositoryStorageDomainService = ({
    RepositoryNamespaceModel,
    RepositoryImportedModel,
    RepositoryItemModel
}) => {

    const ListRepositoryNamespace = (userId) => RepositoryNamespaceModel.findAll({where: { userId }})

    const ListRepositories = (namespaceId) => RepositoryImportedModel.findAll({ where: { namespaceId }, order: [['createdAt', 'DESC']]})

    const GetRepositoryNamespaceId = async (namespace) => {
        const respositoryNamespaceData = await RepositoryNamespaceModel.findOne({ where: { namespace } })
        return respositoryNamespaceData?.id
    }

    const GetNamespace = async (id) => {
        const respositoryNamespaceData = await RepositoryNamespaceModel.findOne({ where: { id }, raw: true })
        return respositoryNamespaceData
    }

    const GetRepositoryImported = (id) => RepositoryImportedModel.findOne({ where: { id } })

    const RegisterRepositoryNamespace = ({ namespace , userId }) => 
        RepositoryNamespaceModel.create({ namespace, userId })

    const RegisterRepositoryImported = ({ namespaceId, repositoryCodePath, sourceType, sourceParams }) => 
        RepositoryImportedModel.create({ namespaceId, repositoryCodePath, sourceType, sourceParams })

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

    const ListLatestPackageItemsByUserId = async (userId) => {
        const items = await RepositoryItemModel.findAll({
            include: [{
                model: RepositoryImportedModel,
                attributes: ['repositoryCodePath'],
                include: [{
                    model: RepositoryNamespaceModel,
                    attributes: ['namespace'],
                    where: { userId }
                }],
                where: {
                    createdAt: {
                        [Op.eq]: literal(`(
                            SELECT MAX("ri"."createdAt")
                            FROM "RepositoryImporteds" AS ri
                            INNER JOIN "RepositoryNamespaces" AS rn
                                ON rn.id = ri."namespaceId"
                            WHERE rn."userId" = ${userId}
                            AND rn.id = "RepositoryImported"."namespaceId"
                        )`)
                    }
                }
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
    
    
    return {
        RegisterRepositoryNamespace,
        RegisterRepositoryImported,
        ListRepositoryNamespace,
        ListRepositories,
        GetRepositoryNamespaceId,
        GetRepositoryNamespaceByRepositoryId,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetItemById,
        ListLatestPackageItemsByUserId,
        GetPackageById,
        GetPackageItemByPath,
        GetNamespace
    }
}

module.exports = CreateRepositoryStorageDomainService