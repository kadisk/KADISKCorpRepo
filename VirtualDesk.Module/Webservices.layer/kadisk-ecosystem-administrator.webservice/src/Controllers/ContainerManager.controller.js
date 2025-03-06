const ContainerManagerController = (params) => {

    const {
        containerManagerService
    } = params

    const controllerServiceObject = {
        controllerName   : "ContainerManagerController",
        ListContainers: containerManagerService.ListAllContainers
    }
    return Object.freeze(controllerServiceObject)
}

module.exports = ContainerManagerController