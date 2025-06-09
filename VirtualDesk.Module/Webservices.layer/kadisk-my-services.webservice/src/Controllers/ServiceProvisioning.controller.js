
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
        startupParams,
        ports
    }, { authenticationData }) => {
         const { userId, username } = authenticationData
        
        await myServicesManagerService
            .ProvisionService({
                userId, 
                username,
                packageId,
                serviceName,
                serviceDescription,
                startupParams, 
                ports
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