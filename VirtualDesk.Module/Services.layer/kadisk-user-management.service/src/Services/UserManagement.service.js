const { Sequelize, DataTypes } = require('sequelize')

const path = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => path
    .join(_path)
    .replace('~', os.homedir())

const UserManagementService = (params) => {

    const {
        onReady,
        storageFilePath
    } = params

    const absolutStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: absolutStorageFilePath
    })

    const UserModel = sequelize.define('User', { 
            name: DataTypes.STRING,
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING
    })

    const _Start = async () => {
        try {
            await sequelize.authenticate()
            await sequelize.sync()
            onReady()
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }

    _Start()

    const _CheckUserExist = async ({ email , username }) => {
        const existingUser = await UserModel.findOne({
            where: {
                [Sequelize.Op.or]: [{ email }, { username }]
            }
        })
        return existingUser
    }

    const CreateNewUser = async ({ name, username, email, password }) => {
        try {
            const existingUser = await _CheckUserExist({ email , username })

            if (existingUser) 
                throw new Error('User with the same email or username already exists')

            const newUser = await UserModel.create({ name, username, email, password })
            return newUser
        } catch (error) {
            console.error('Error creating user:', error)
            throw error
        }
    }

    const ListUsers = async () => {
        try {
            const users = await UserModel.findAll({
                attributes: { exclude: ['password'] }
            })
            return users
        } catch (error) {
            console.error('Error listing users:', error)
            throw error
        }
    }
    
    return {
        CreateNewUser,
        ListUsers
    }

}

module.exports = UserManagementService