
const RequestTypes = Object.freeze({
    INSTANCE_DATA_LIST        : Symbol(),
    BUILD_DATA_LIST           : Symbol(),
    CREATE_NEW_INSTANCE       : Symbol(),
    CREATE_NEW_CONTAINER      : Symbol(),
    CONTAINER_DATA            : Symbol(),
    CONTAINER_INSPECTION_DATA : Symbol(),
    START_CONTAINER           : Symbol(),
    STOP_CONTAINER            : Symbol()
})

module.exports = RequestTypes