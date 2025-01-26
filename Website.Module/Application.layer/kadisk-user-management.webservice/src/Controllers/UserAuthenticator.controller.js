const UserAuthenticatorController = (params) =>{

    const Login = ({ username, password }) => {

    }

    const Logout = () => {

    }

    const controllerServiceObject = {
        controllerName : "UserAuthenticatorController",
        Login, Logout
    }

    return Object.freeze(controllerServiceObject)
}

module.exports =  UserAuthenticatorController