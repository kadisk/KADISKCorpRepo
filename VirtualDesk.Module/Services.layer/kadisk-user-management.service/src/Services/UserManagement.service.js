const { Sequelize, DataTypes } = require('sequelize')
const jwt = require('jsonwebtoken')
const path = require("path")
const os = require('os')
const crypto = require('crypto')

const ConvertPathToAbsolutPath = (_path) => path
    .join(_path)
    .replace('~', os.homedir())

// Constantes para o usuário padrão
const DEFAULT_USER = 'su'
const DEFAULT_PASSWORD = 'su'

const UserManagementService = (params) => {

    const {
        secretKey,
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

            const userCount = await UserModel.count()
            if (userCount === 0) {
                const hashedPassword = hashPassword(DEFAULT_PASSWORD)
                await UserModel.create({ name: DEFAULT_USER, username: DEFAULT_USER, email: '', password: hashedPassword })
            }

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

    const hashPassword = (password) => {
        return crypto.createHash('sha256').update(password).digest('hex')
    }

    const CreateNewUser = async ({ name, username, email, password }) => {
        try {
            const existingUser = await _CheckUserExist({ email , username })

            if (existingUser) 
                throw new Error('User with the same email or username already exists')

            const hashedPassword = hashPassword(password)
            const newUser = await UserModel.create({ name, username, email, password: hashedPassword })
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

    const VerifyPasswordAndGetUser = async ({ username, password }) => {
        try {
            const hashedPassword = hashPassword(password)
            const user = await UserModel.findOne({ 
                attributes: { exclude: ['password'] },
                where: { username, password: hashedPassword }
            })
            return user
        } catch (error) {
            console.error('Error verifying password:', error)
            throw error
        }
    }

    const SignToken = async ({ username, password }) => {
        
        const user = await VerifyPasswordAndGetUser({ username, password })

        if (user){
            const { id, username } = user
            const token = jwt.sign({ userId: id, username }, secretKey, { expiresIn: '1h' })
            return token
        }else {
            return undefined
        }
    }

    const GetUser = async (id) => {
        try {
            const user = await UserModel.findOne({
                attributes: { exclude: ['password'] },
                where: { id }
            })
            return user
        } catch (error) {
            console.error('Error getting user:', error)
            throw error
        }
    }
    
    return {
        CreateNewUser,
        ListUsers,
        SignToken,
        GetUser
    }

}

module.exports = UserManagementService