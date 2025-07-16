
const RequestTypes = Object.freeze({
    LAST_INSTANCE_DATA: Symbol(),
    CONTAINER_DATA: Symbol(),
    CONTAINER_INSPECTION_DATA: Symbol(),
    START_CONTAINER: Symbol(),
    STOP_CONTAINER: Symbol()
})

module.exports = RequestTypes