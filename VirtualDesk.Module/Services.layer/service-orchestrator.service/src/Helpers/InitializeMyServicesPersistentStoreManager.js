const { Sequelize, DataTypes } = require("sequelize")

const InitializeMyServicesPersistentStoreManager = (storage) => {

    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage
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
            allowNull: false
        },
        originPackageId: {
            type: DataTypes.INTEGER,
            allowNull: true
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

    ServiceModel            .hasMany(ImageBuildHistoryModel, { foreignKey: "serviceId",   onDelete: "CASCADE" })
    InstanceModel           .hasMany(ImageBuildHistoryModel, { foreignKey: "instanceId",  onDelete: "CASCADE" })
    InstanceModel           .hasMany(ContainerModel,         { foreignKey: "instanceId",  onDelete: "CASCADE" })
    ImageBuildHistoryModel  .hasMany(ContainerModel,         { foreignKey: "buildId",     onDelete: "CASCADE" })
    ServiceModel            .hasMany(InstanceModel,          { foreignKey: "serviceId",   onDelete: "CASCADE" })
    ContainerModel          .hasMany(ContainerEventLogModel, { foreignKey: "containerId", onDelete: "CASCADE" })

    ContainerModel         .belongsTo(InstanceModel,            { foreignKey: "instanceId" })
    ContainerModel         .belongsTo(ImageBuildHistoryModel,   { foreignKey: "buildId" })
    ContainerEventLogModel .belongsTo(ImageBuildHistoryModel,   { foreignKey: "containerId" })
    ImageBuildHistoryModel .belongsTo(InstanceModel,            { foreignKey: "instanceId" })
    InstanceModel          .belongsTo(ServiceModel,             { foreignKey: "serviceId" })
    

    return {
        models: {
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

module.exports = InitializeMyServicesPersistentStoreManager