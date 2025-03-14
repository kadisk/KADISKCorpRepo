const AuthenticatorController = (params) =>{

    const Authenticate = ({ username, password }) => {
        console.log({ username, password })
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