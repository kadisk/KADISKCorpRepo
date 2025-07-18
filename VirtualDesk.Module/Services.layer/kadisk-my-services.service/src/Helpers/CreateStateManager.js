const EventEmitter = require("events")


const CreateStateManager = () => {

    const eventEmitter = new EventEmitter()

    const STATUS_CHANGE_EVENT = Symbol()

    const stateList = []

    const CreateNewState = (group, key, defaultStatus) => {
        const newState = {
            group,
            key,
            status      : defaultStatus,
            dynamicData : {},
            data        : {},
            error       : undefined
        }
        stateList.push(newState)
    }

    const GetState = (group, key) => {
        const state = stateList.find(s => s.group === group && s.key === key)
        return state
    }

    const FindState = (group, property, value) => {
        const state = stateList.find(s => s.group === group && s.data[property] === value)
        if (!state) {
            throw new Error(`State with group ${group}, key ${key} and property ${property} with value ${value} does not exist`)
        }
        return state
    }

    const FindData = (group, property, value) => {
        const state = FindState(group, property, value)
        return state.data
    }

    const ChangeStatus = (group, key, newStatus) => {
        const state = GetState(group, key)
        if (!state) throw new Error(`State with group ${group.description} and key ${key} does not exist`)
        if (state.status === newStatus) return
        state.status = newStatus
        eventEmitter.emit(STATUS_CHANGE_EVENT, {group, key})
    }

    const onChangeStatus = (_group, f) => {
        eventEmitter.on(STATUS_CHANGE_EVENT, ({group, key}) => {

            if (group !== _group) return
            f({ key, status: GetState(group, key).status })
        })
    }

    const SetData = (group, key, data) => {
        const state = GetState(group, key)
        state.data = data
    }

    const UpdateData = (group, key, data) => {
        const state = GetState(group, key)
        state.data = { ...state.data, ...data }
    }

    const FindKey = (group, property, value) => {
        const state = stateList.find(s => s.group === group && s.data[property] === value)
        if (!state) {
            throw new Error(`State with group ${group} and property ${property} with value ${value} does not exist`)
        }
        return state.key
    }

    return {
        CreateNewState,
        ChangeStatus,
        GetState,
        FindData,
        onChangeStatus,
        SetData,
        UpdateData,
        FindKey
    }
}

module.exports = CreateStateManager