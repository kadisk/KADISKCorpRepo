const { Sequelize, DataTypes } = require('sequelize')

const InitializeMyServicePersistentStoreManager = (storage) => {

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage
    })

    const RepositoryModel = sequelize.define('Repository', { 
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            namespace: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId:{
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
                key: 'id'
            },
            onDelete: "CASCADE"
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'RepositoryItems',
                key: 'id'
            },
            onDelete: "CASCADE"
        }
    })

    RepositoryModel.hasMany(RepositoryItemModel, {
        foreignKey: 'repositoryId',
        onDelete: 'CASCADE'
    })

    RepositoryItemModel.belongsTo(RepositoryModel, {
        foreignKey: 'repositoryId'
    })

    RepositoryItemModel.hasMany(RepositoryItemModel, {
        foreignKey: 'parentId',
        as: 'children',
        onDelete: 'CASCADE'
    })
    
    RepositoryItemModel.belongsTo(RepositoryItemModel, {
        foreignKey: 'parentId',
        as: 'parent'
    })

    return {
        models:{
            Repository: RepositoryModel,
            RepositoryItem: RepositoryItemModel
        },
        ConnectAndSync: async () => {
            await sequelize.authenticate()
            await sequelize.sync()
        }
    }
}

module.exports = InitializeMyServicePersistentStoreManager