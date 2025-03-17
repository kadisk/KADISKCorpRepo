const AuthenticatorController = (params) => {


    const {
        userManagementService
    } = params

    const GetToken = async ({ username, password }) => {
        const token = await userManagementService.SignToken({ username, password })
        if (token){
            return { token }
        }else {
            throw new Error('Invalid credentials')
        }
    }


    const controllerServiceObject = {
        controllerName : "AuthenticatorController",
        GetToken
    }

    return Object.freeze(controllerServiceObject)
}

module.exports =  AuthenticatorController