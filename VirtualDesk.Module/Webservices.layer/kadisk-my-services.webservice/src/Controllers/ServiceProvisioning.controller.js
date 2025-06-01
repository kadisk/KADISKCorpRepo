
const ServiceProvisioningController = (params) => {

    const { myServicesManagerService } = params

    const ListBootablePackages = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return myServicesManagerService.ListBootablePackages({ userId, username })
    }


    const ProvisionService = async ({
        packageId,
        serviceName,
        serviceDescription,
        startupParams
    }, { authenticationData }) => {
         const { userId, username } = authenticationData
        
        myServicesManagerService
            .ProvisionService({
                userId, 
                username,
                packageId,
                serviceName,
                serviceDescription,
                startupParams
            })
    }

    const GetStartupParamsData = async (packageId) => { 
        const metadata = await myServicesManagerService.GetMetadataByPackageId(packageId)

        return metadata
    }

    const controllerServiceObject = {
        controllerName: "ServiceProvisioningController",
        ListBootablePackages,
        ProvisionService,
        GetStartupParamsData
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceProvisioningController