const CreateMyWorkspaceDomainService = ({
    RepositoryModel,
    RepositoryItemModel
}) => {

    const ListRepositories = (userId) => RepositoryModel.findAll({where: { userId }})

    const GetRepositoryByNamespace = (namespace) => RepositoryModel.findOne({ where: { namespace } })
    const GetRepositoryById = (id) => RepositoryModel.findOne({ where: { id } })

    const CreateRepository = ({ repositoryNamespace , userId, repositoryCodePath }) => RepositoryModel.create({ namespace: repositoryNamespace, userId, repositoryCodePath})

    const ListItemByRepositoryId = (repositoryId) => RepositoryItemModel.findAll({ where: { repositoryId }, raw: true})
    const GetItemById = (id) => RepositoryItemModel.findOne({ where: { id } })

    /*const ListItemByUserId = async (userId) => {
        return RepositoryItemModel.findAll({
            include: [{
                model: RepositoryModel,
                where: { userId },
                attributes: ['id', 'namespace']
            }],
            raw: true
        })
    }*/

    const ListPackageItemByUserId = async (userId) => {
        const items = await RepositoryItemModel.findAll({
            include: [{
                model: RepositoryModel,
                where: { userId },
                attributes: ['id', 'namespace']
            }],
            where: {
                itemType: ['app', 'cli', 'webapp', 'webgui', 'webservice', 'service', 'lib']
            },
            raw: true
        })

        return items
    }

    return {
        CreateRepository,
        ListRepositories,
        GetRepository:{
            ByNamespace: GetRepositoryByNamespace,
            ById: GetRepositoryById
        },
        ListItemByRepositoryId,
        GetItemById,
        ListPackageItemByUserId
    }
}

module.exports = CreateMyWorkspaceDomainService