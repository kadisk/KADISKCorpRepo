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

    return {
        CreateRepository,
        ListRepositories,
        GetRepository:{
            ByNamespace: GetRepositoryByNamespace,
            ById: GetRepositoryById
        },
        ListItemByRepositoryId,
        GetItemById
    }
}

module.exports = CreateMyWorkspaceDomainService