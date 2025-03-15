const AuthenticatorController = (params) => {


    const {
        userManagementService
    } = params

    const Authenticate = async ({ username, password }) => {
        const token = await userManagementService.SignToken({ username, password })
        if (token){
            return { token }
        }else {
            throw new Error('Invalid credentials')
        }
    }

    const Logout = () => {
    
    }

    const GetUserData = async () => {
        console.log('GetUserData')
    }

    const controllerServiceObject = {
        controllerName : "AuthenticatorController",
        Authenticate,
        Logout,
        GetUserData
    }

    return Object.freeze(controllerServiceObject)
}

module.exports =  AuthenticatorController