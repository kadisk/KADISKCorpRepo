const AuthenticatorController = (params) =>{

    const Login = ({ username, password }) => {

    }

    const Logout = () => {

    }

    const controllerServiceObject = {
        controllerName : "AuthenticatorController",
        Login, Logout
    }

    return Object.freeze(controllerServiceObject)
}

module.exports =  AuthenticatorController