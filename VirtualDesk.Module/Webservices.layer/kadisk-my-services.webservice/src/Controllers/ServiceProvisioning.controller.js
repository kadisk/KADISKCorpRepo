
const ServiceProvisioningController = (params) => {

    const { myServicesManagerService } = params

    const ListBootablePackages = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return myServicesManagerService.ListBootablePackages({ userId, username })
    }

    const ListApplications = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return myServicesManagerService.ListApplications(userId)
    }

    

    const ProvisionServiceFromApplication = async ({ appType, executableName, repositoryId, packagePath }, { authenticationData }) => {  
        const { userId, username } = authenticationData
        
        myServicesManagerService.ProvisionServiceFromApplication({
                userId, 
                username,
                appType, 
                executableName, 
                repositoryId, 
                packagePath 
            })

    }

    const ProvisionServiceFromPackage = async (packageId, { authenticationData }) => {
        
    }

    const controllerServiceObject = {
        controllerName: "ServiceProvisioningController",
        ListBootablePackages,
        ProvisionServiceFromPackage,
        ProvisionServiceFromApplication,
        ListApplications
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceProvisioningController