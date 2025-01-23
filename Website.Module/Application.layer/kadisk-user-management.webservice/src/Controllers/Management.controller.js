const ManagementController = (params) =>{

    const CreateNewUser = ({
        name,
        username,
        email,
        password
    }) => {
        
    }

    const GetUserDetails = (userId) => {

    }
    const UpdateUser = ({ userId, name}) => {

    }

    const DisableUser = (userId) => {

    }
    const ListUsers = () => {

    }

    const controllerServiceObject = {
        controllerName   : "ManagementController",
        CreateNewUser,
        GetUserDetails,
        UpdateUser,
        DisableUser,
        ListUsers
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ManagementController