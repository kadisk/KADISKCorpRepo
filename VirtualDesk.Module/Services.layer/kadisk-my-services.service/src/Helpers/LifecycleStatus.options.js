
const LifecycleStatusOptions = Object.freeze({
    UNKNOWN               : Symbol("UNKNOWN"),
    LOADING_INSTANCE_DATA : Symbol("LOADING_INSTANCE_DATA"),
    INSTANCE_DATA_LOADED  : Symbol("INSTANCE_DATA_LOADED"),
    CONTAINER_DATA_LOADED : Symbol("CONTAINER_DATA_LOADED"),
    BUILDING              : Symbol("BUILDING"),
    STARTING              : Symbol("STARTING"),
    STOPPING              : Symbol("STOPPING"),
    STOPPED               : Symbol("STOPPED"),
    RUNNING               : Symbol("RUNNING"),
    FAILURE               : Symbol("FAILURE"),
    TERMINATED            : Symbol("TERMINATED")
})

module.exports = LifecycleStatusOptions