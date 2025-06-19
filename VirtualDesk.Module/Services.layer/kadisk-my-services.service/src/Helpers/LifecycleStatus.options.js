
const LifecycleStatusOptions = Object.freeze({
    UNKNOWN    : Symbol("UNKNOWN"),
    LOADING    : Symbol("LOADING"),
    LOADED     : Symbol("LOADED"),
    STARTING   : Symbol("STARTING"),
    STOPPING   : Symbol("STOPPING"),
    RUNNING    : Symbol("RUNNING"),
    FAILURE    : Symbol("FAILURE"),
    TERMINATED : Symbol("TERMINATED")
})

module.exports = LifecycleStatusOptions