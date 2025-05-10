const ContainerManagerController = (params) => {

    const {
        containerManagerService
    } = params

    const controllerServiceObject = {
        controllerName : "ContainerManagerController",
        ListContainers: containerManagerService.ListAllContainers,
        RemoveContainer: containerManagerService.RemoveContainer,
        StartContainer: containerManagerService.StartContainer,
        StopContainer: containerManagerService.StopContainer
    }
    
    return Object.freeze(controllerServiceObject)

}

module.exports = ContainerManagerController