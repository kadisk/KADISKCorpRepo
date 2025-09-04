const { Sequelize, DataTypes } = require("sequelize")

const InitializeMyServicePersistentStoreManager = (storage) => {

    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage
    })

    const RepositoryNamespaceModel = sequelize.define("RepositoryNamespace", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        namespace: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    
    const RepositoryImportedModel = sequelize.define("RepositoryImported", { 
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        namespaceId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        repositoryCodePath: DataTypes.STRING,
        sourceType:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        sourceParams: {
            type: DataTypes.JSON,
            allowNull: true
        }
    })

    const RepositoryItemModel = sequelize.define("RepositoryItem", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemPath: {
            type: DataTypes.STRING,
            allowNull: false
        },
        repositoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: RepositoryImportedModel,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "RepositoryItems",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    })

    const ServiceModel = sequelize.define("Service", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        serviceName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        serviceDescription: {
            type: DataTypes.STRING,
            allowNull: false
        },
        instanceRepositoryCodePath: {
            type: DataTypes.STRING,
            allowNull: false
        },
        originRepositoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: RepositoryImportedModel,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        packageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: RepositoryItemModel,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    })
    
    const InstanceModel = sequelize.define("Instance", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        startupParams: {
            type: DataTypes.JSON,
            allowNull: true
        },
        ports: {
            type: DataTypes.JSON,
            allowNull: true
        },
        networkmode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ServiceModel,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        terminateDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    })

    const ImageBuildHistoryModel = sequelize.define("ImageBuildHistory", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hashId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        instanceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: InstanceModel,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    })

    const ContainerModel = sequelize.define("Container", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        containerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        instanceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: InstanceModel,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        buildId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ImageBuildHistoryModel,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    })

    const ContainerEventLogModel = sequelize.define("ContainerEventLogModel", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        event: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payload: {
            type: DataTypes.JSON,
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        containerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ContainerModel,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    })

    RepositoryNamespaceModel.hasMany(RepositoryImportedModel, { foreignKey: "namespaceId", onDelete: "CASCADE" })
    RepositoryImportedModel .hasMany(RepositoryItemModel,    { foreignKey: "repositoryId", onDelete: "CASCADE" })
    RepositoryItemModel     .hasMany(RepositoryItemModel,    { foreignKey: "parentId", as: "children", onDelete: "CASCADE" })
    RepositoryImportedModel .hasMany(ServiceModel,           { foreignKey: "originRepositoryId", onDelete: "CASCADE" })
    ServiceModel            .hasMany(ImageBuildHistoryModel, { foreignKey: "serviceId",   onDelete: "CASCADE" })
    InstanceModel           .hasMany(ImageBuildHistoryModel, { foreignKey: "instanceId",  onDelete: "CASCADE" })
    InstanceModel           .hasMany(ContainerModel,         { foreignKey: "instanceId",  onDelete: "CASCADE" })
    ImageBuildHistoryModel  .hasMany(ContainerModel,         { foreignKey: "buildId",     onDelete: "CASCADE" })
    ServiceModel            .hasMany(InstanceModel,          { foreignKey: "serviceId",   onDelete: "CASCADE" })
    ContainerModel          .hasMany(ContainerEventLogModel, { foreignKey: "containerId", onDelete: "CASCADE" })

    RepositoryImportedModel.belongsTo(RepositoryNamespaceModel, { foreignKey: "namespaceId" })
    RepositoryItemModel    .belongsTo(RepositoryImportedModel,  { foreignKey: "repositoryId" })
    ServiceModel           .belongsTo(RepositoryImportedModel,  { foreignKey: "originRepositoryId" })
    ServiceModel           .belongsTo(RepositoryItemModel,      { foreignKey: "packageId" })
    ContainerModel         .belongsTo(InstanceModel,            { foreignKey: "instanceId" })
    ContainerModel         .belongsTo(ImageBuildHistoryModel,   { foreignKey: "buildId" })
    ContainerEventLogModel .belongsTo(ImageBuildHistoryModel,   { foreignKey: "containerId" })
    ImageBuildHistoryModel .belongsTo(InstanceModel,            { foreignKey: "instanceId" })
    InstanceModel          .belongsTo(ServiceModel,             { foreignKey: "serviceId" })
    InstanceModel          .belongsTo(ServiceModel,             { foreignKey: "serviceId" })
    RepositoryItemModel    .belongsTo(RepositoryItemModel,      { foreignKey: "parentId", as: "parent"})

    return {
        models: {
            RepositoryNamespace: RepositoryNamespaceModel,
            RepositoryImported: RepositoryImportedModel,
            RepositoryItem: RepositoryItemModel,
            Service: ServiceModel,
            ImageBuildHistory: ImageBuildHistoryModel,
            Instance: InstanceModel,
            Container: ContainerModel,
            ContainerEventLog: ContainerEventLogModel
        },
        ConnectAndSync: async () => {
            await sequelize.authenticate()
            await sequelize.sync()
            //await sequelize.sync({ force: true }) 
        }
    }
}

module.exports = InitializeMyServicePersistentStoreManager