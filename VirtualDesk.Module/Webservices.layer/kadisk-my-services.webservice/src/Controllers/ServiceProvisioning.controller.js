
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
        ports,
        networkmode
    }, { authenticationData }) => {
         const { userId, username } = authenticationData
        
        await myServicesManagerService
            .ProvisionService({
                username,
                packageId,
                serviceName,
                serviceDescription,
                startupParams, 
                ports,
                networkmode
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