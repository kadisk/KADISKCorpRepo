
const ServiceProvisioningController = (params) => {

    const { myServicesManagerService } = params


    const ListBootablePackages = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return myServicesManagerService
            .ListBootablePackages({ userId, username })
    }

    const controllerServiceObject = {
        controllerName: "ServiceProvisioningController",
        ListBootablePackages
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceProvisioningController