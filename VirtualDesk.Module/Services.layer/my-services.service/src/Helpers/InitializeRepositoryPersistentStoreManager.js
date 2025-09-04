const { Sequelize, DataTypes } = require("sequelize")

const InitializeRepositoryPersistentStoreManager = (storage) => {

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
    
    RepositoryNamespaceModel.hasMany(RepositoryImportedModel, { foreignKey: "namespaceId", onDelete: "CASCADE" })
    RepositoryImportedModel .hasMany(RepositoryItemModel,    { foreignKey: "repositoryId", onDelete: "CASCADE" })
    RepositoryItemModel     .hasMany(RepositoryItemModel,    { foreignKey: "parentId", as: "children", onDelete: "CASCADE" })

    RepositoryImportedModel.belongsTo(RepositoryNamespaceModel, { foreignKey: "namespaceId" })
    RepositoryItemModel    .belongsTo(RepositoryImportedModel,  { foreignKey: "repositoryId" })
    RepositoryItemModel    .belongsTo(RepositoryItemModel,      { foreignKey: "parentId", as: "parent"})

    return {
        models: {
            RepositoryNamespace: RepositoryNamespaceModel,
            RepositoryImported: RepositoryImportedModel,
            RepositoryItem: RepositoryItemModel
        },
        ConnectAndSync: async () => {
            await sequelize.authenticate()
            await sequelize.sync()
            //await sequelize.sync({ force: true }) 
        }
    }
}

module.exports = InitializeRepositoryPersistentStoreManager