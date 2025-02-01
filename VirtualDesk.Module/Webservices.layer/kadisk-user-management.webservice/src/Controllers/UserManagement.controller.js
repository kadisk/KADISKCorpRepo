const UserManagementController = (params) =>{

    const {
        userManagementService
    } = params

    const CreateNewUser = async ({
        name,
        username,
        email,
        password
    }) => {

        return await userManagementService.CreateNewUser({
            name,
            username,
            email,
            password
        })
    }

    const GetUserDetails = (userId) => {

    }
    const UpdateUser = ({ userId, name}) => {

    }

    const DisableUser = (userId) => {

    }
    const ListUsers = async () => {
        return await userManagementService.ListUsers()
    }

    const controllerServiceObject = {
        controllerName   : "UserManagementController",
        CreateNewUser,
        GetUserDetails,
        UpdateUser,
        DisableUser,
        ListUsers
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = UserManagementController