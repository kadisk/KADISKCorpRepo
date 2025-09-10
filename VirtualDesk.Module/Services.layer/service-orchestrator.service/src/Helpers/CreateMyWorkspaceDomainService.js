const { Op } = require('sequelize')


const CreateMyWorkspaceDomainService = ({
    ServiceModel,
    ImageBuildHistoryModel,
    InstanceModel,
    ContainerModel,
    ContainerEventLogModel
}) => {
    
    const ListServicesByRepositoryIds = async (repositoryIds) => {
        const items = await ServiceModel.findAll({
            include: [
                {
                    model: InstanceModel,
                    include: [{
                        model: ImageBuildHistoryModel,
                    }]
                }
            ],
            where: {
                originRepositoryId: {
                    [Op.in]: repositoryIds
                }
            },
            distinct: true 
        })
        return items
    }

    const ListAllServiceId = async () => {
        const items = await ServiceModel.findAll()
        return items?.map( item => item.id )
    }

    const GetServiceById = async (serviceId) => 
        await ServiceModel.findOne({
            where: {
                id: serviceId
            },
            raw: true
        })


    const RegisterServiceProvisioning = ({ 
        serviceName,
        serviceDescription,
        originRepositoryId,
        originPackageId,
        instanceRepositoryCodePath
    }) => 
        ServiceModel
            .create({ 
                serviceName,
                serviceDescription,
                originRepositoryId,
                originPackageId,
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
        RegisterServiceProvisioning,
        RegisterInstanceCreation,
        RegisterTerminateInstance,
        RegisterBuildedImage,
        ListAllServiceId,
        ListServicesByRepositoryIds,
        GetServiceById,
        ListImageBuildHistoryByServiceId,
        ListInstancesByServiceId,
        ListContainersByServiceId,
        ListActiveInstancesByServiceId,
        GetLastInstanceByServiceId,
        GetContainerInfoByInstanceId,
        RegisterContainer,
    }
}

module.exports = CreateMyWorkspaceDomainService