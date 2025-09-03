const { Sequelize, DataTypes } = require('sequelize')

const CreateMonitoringDatabaseHandler = ({
    absolutStorageFilePath,
    monitoringUUID
}) => {

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: absolutStorageFilePath
    })

    const SocketFileModel = sequelize.define('SocketFile', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        monitoringUUID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        socketFilePath: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })


    const ConnectionLogsModel = sequelize.define("ConnectionLogs", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        socketFileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: SocketFileModel,
                key: 'id'
            },
            onDelete: "CASCADE"
        }
    })

    const InstanceInformationModel = sequelize.define("InstanceInformation", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false
        },
        arch: {
            type: DataTypes.STRING,
            allowNull: false
        },
        socketFileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: SocketFileModel,
                key: 'id'
            },
            onDelete: "CASCADE"
        }
    })

    SocketFileModel.hasMany(ConnectionLogsModel, {
        foreignKey: 'socketFileId',
        onDelete: 'CASCADE'
    })

    ConnectionLogsModel.belongsTo(SocketFileModel, {
        foreignKey: 'socketFileId'
    })

    SocketFileModel.hasMany(InstanceInformationModel, {
        foreignKey: 'socketFileId',
        onDelete: 'CASCADE'
    })

    InstanceInformationModel.belongsTo(SocketFileModel, {
        foreignKey: 'socketFileId'
    })

    const RegisterAllSocketFiles = async (socketFilePaths) => {
        const listForCreate = socketFilePaths
            .map((socketFilePath) => ({ socketFilePath,monitoringUUID }))

        await SocketFileModel.bulkCreate(listForCreate)
    }

    const GetAllSocketFile = () => 
        SocketFileModel.findAll({ where: { monitoringUUID } })



    const GetConnectionStatus = (socketFileIds) => 
        ConnectionLogsModel.findAll({
            where: {
                socketFileId: socketFileIds
            },
            attributes: [
                'id',
                'status',
                'socketFileId',
                'createdAt'
            ],
            include: [
                {
                    model: SocketFileModel,
                    as: 'SocketFile'
                }
            ],
            order: [['createdAt', 'DESC']],
            group: ['socketFileId']
    })

    const RegisterConnectionStatusChange = (socketFileId, status) => 
        ConnectionLogsModel.create({ socketFileId, status })


    const Initialize = async () => {
        await sequelize.authenticate()
        await sequelize.sync()
    }

    return {
        Initialize,
        RegisterAllSocketFiles,
        GetAllSocketFile,
        GetConnectionStatus,
        RegisterConnectionStatusChange
    }


}

module.exports = CreateMonitoringDatabaseHandler