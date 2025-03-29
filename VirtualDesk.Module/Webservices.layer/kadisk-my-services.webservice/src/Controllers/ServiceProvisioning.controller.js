
const ServiceProvisioningController = (params) => {

    const { myServicesManagerService } = params


    

    const ListBootablePackages = ({ authenticationData }) => {
        return []
    }

    const controllerServiceObject = {
        controllerName: "ServiceProvisioningController",
        ListBootablePackages
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceProvisioningController