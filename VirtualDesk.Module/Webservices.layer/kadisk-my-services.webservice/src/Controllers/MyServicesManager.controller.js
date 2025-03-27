
const MyServicesManagerController = (params) => {

    const { myServicesManagerService } = params

    const GetMyServicesStatus = ({ authenticationData }) => {
        const { userId } = authenticationData
        return myServicesManagerService.GetStatus(userId)
    }

    const controllerServiceObject = {
        controllerName: "MyServicesManagerController",
        GetMyServicesStatus
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyServicesManagerController