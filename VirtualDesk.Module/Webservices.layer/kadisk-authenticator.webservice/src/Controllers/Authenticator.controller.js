const AuthenticatorController = (params) => {


    const {
        userManagementService
    } = params

    const Authenticate = async ({ username, password }) => {
        const token = await userManagementService.SignToken({ username, password })
        if (token){
            return token
        }else {
            throw new Error('Invalid credentials')
        }
    }

    const Logout = () => {
    
    }

    const controllerServiceObject = {
        controllerName : "AuthenticatorController",
        Authenticate,
        Logout
    }

    return Object.freeze(controllerServiceObject)
}

module.exports =  AuthenticatorController