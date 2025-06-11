const { Sequelize, DataTypes } = require("sequelize")

const InitializePersistentStoreManager = (storage) => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage
    })

    const RepositoryModel = sequelize.define("Repository", { 
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        namespace: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        repositoryCodePath: DataTypes.STRING
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
                model: RepositoryModel,
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
                model: RepositoryModel,
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
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ServiceModel,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    })

    const ContainerStatusHistoryModel = sequelize.define("ContainerStatusHistory", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        containerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
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

    RepositoryModel.hasMany(RepositoryItemModel, {
        foreignKey: "repositoryId",
        onDelete: "CASCADE"
    })

    RepositoryItemModel.hasMany(RepositoryItemModel, {
        foreignKey: "parentId",
        as: "children",
        onDelete: "CASCADE"
    })

    RepositoryModel.hasMany(ServiceModel, {
        foreignKey: "originRepositoryId",
        onDelete: "CASCADE"
    })

    ServiceModel.hasMany(ImageBuildHistoryModel, {
        foreignKey: "serviceId",
        onDelete: "CASCADE"
    })

    InstanceModel.hasMany(ImageBuildHistoryModel, {
        foreignKey: "instanceId",
        onDelete: "CASCADE"
    })

    ServiceModel.hasMany(InstanceModel, {
        foreignKey: "serviceId",
        onDelete: "CASCADE"
    })

    RepositoryItemModel.belongsTo(RepositoryModel, {
        foreignKey: "repositoryId"
    })

    ServiceModel.belongsTo(RepositoryModel, {
        foreignKey: "originRepositoryId"
    })

    ServiceModel.belongsTo(RepositoryItemModel, {
        foreignKey: "packageId"
    })

    ImageBuildHistoryModel.belongsTo(InstanceModel, {
        foreignKey: "instanceId"
    })

    InstanceModel.belongsTo(ServiceModel, {
        foreignKey: "serviceId"
    })

    InstanceModel.belongsTo(ServiceModel, {
        foreignKey: "serviceId"
    })

    RepositoryItemModel.belongsTo(RepositoryItemModel, {
        foreignKey: "parentId",
        as: "parent"
    })

    return {
        models: {
            Repository: RepositoryModel,
            RepositoryItem: RepositoryItemModel,
            Service: ServiceModel,
            ImageBuildHistory: ImageBuildHistoryModel,
            Instance: InstanceModel
        },
        ConnectAndSync: async () => {
            await sequelize.authenticate()
            await sequelize.sync()
            //await sequelize.sync({ force: true }) 
        }
    }
}

module.exports = InitializePersistentStoreManager