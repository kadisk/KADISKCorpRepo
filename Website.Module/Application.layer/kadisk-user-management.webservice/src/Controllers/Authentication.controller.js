const AuthenticationController = (params) =>{

    const Login = ({ username, password }) => {

    }

    const Logout = () => {

    }

    const controllerServiceObject = {
        controllerName : "AuthenticationController",
        Login, Logout
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = AuthenticationController