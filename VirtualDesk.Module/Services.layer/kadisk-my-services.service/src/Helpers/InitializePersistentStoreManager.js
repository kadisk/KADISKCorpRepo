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

    const ProvisionedServiceModel = sequelize.define("ProvisionedService", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        executableName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        appType: {
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
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ProvisionedServiceModel,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    })

    const ServiceInstanceModel = sequelize.define("ServiceInstance", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        containerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        buildId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ImageBuildHistoryModel,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ProvisionedServiceModel,
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

    RepositoryModel.hasMany(ProvisionedServiceModel, {
        foreignKey: "repositoryId",
        onDelete: "CASCADE"
    })

    ProvisionedServiceModel.hasMany(ImageBuildHistoryModel, {
        foreignKey: "serviceId",
        onDelete: "CASCADE"
    })

    ImageBuildHistoryModel.hasMany(ServiceInstanceModel, {
        foreignKey: "buildId",
        onDelete: "CASCADE"
    })

    ProvisionedServiceModel.hasMany(ServiceInstanceModel, {
        foreignKey: "serviceId",
        onDelete: "CASCADE"
    })

    RepositoryItemModel.belongsTo(RepositoryModel, {
        foreignKey: "repositoryId"
    })

    ProvisionedServiceModel.belongsTo(RepositoryModel, {
        foreignKey: "repositoryId"
    })

    ProvisionedServiceModel.belongsTo(RepositoryItemModel, {
        foreignKey: "packageId"
    })

    ImageBuildHistoryModel.belongsTo(ProvisionedServiceModel, {
        foreignKey: "serviceId"
    })

    ServiceInstanceModel.belongsTo(ImageBuildHistoryModel, {
        foreignKey: "buildId"
    })

    ServiceInstanceModel.belongsTo(ProvisionedServiceModel, {
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
            ProvisionedService: ProvisionedServiceModel,
            ImageBuildHistory: ImageBuildHistoryModel,
            ServiceInstance: ServiceInstanceModel
        },
        ConnectAndSync: async () => {
            await sequelize.authenticate()
            await sequelize.sync()
            //await sequelize.sync({ force: true }) 
        }
    }
}

module.exports = InitializePersistentStoreManager