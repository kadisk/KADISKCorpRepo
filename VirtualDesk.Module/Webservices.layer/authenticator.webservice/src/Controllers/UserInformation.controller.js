

const UserInformationController = (params) => {

    const {
        userManagementService
    } = params

    const Logout = () => {
    
    }

    const GetUserData = async ({ authenticationData }) => {
        const { userId } = authenticationData
        return await userManagementService.GetUser(userId)
    }

    const controllerServiceObject = {
        controllerName : "UserInformationController",
        GetUserData,
        Logout
    }

    return Object.freeze(controllerServiceObject)
    
}

module.exports =  UserInformationController