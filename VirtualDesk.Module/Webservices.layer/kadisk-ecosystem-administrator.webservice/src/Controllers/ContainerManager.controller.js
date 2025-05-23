const ContainerManagerController = (params) => {

    const {
        containerManagerService
    } = params

    const controllerServiceObject = {
        controllerName : "ContainerManagerController",
        ListContainers: containerManagerService.ListAllContainers,
        ListImages: containerManagerService.ListAllImages,
        ListNetworks: containerManagerService.ListAllNetworks,
        RemoveContainer: containerManagerService.RemoveContainer,
        StartContainer: containerManagerService.StartContainer,
        StopContainer: containerManagerService.StopContainer,
    }
    
    return Object.freeze(controllerServiceObject)

}

module.exports = ContainerManagerController