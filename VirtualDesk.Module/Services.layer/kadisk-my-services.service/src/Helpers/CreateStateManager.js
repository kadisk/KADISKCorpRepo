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
            data        : {},
            error       : undefined
        }
        stateList.push(newState)
    }

    const GetState = (group, key) => {
        const state = stateList.find(s => s.group === group && s.key == key)
        return state
    }

    const FindState = (group, property, value) => {
        const state = stateList.find(s => s.group === group && s.data[property] === value)
        return state
    }

    const FindData = (group, property, value) => {
        const state = FindState(group, property, value)

        if (state?.data) {
            return state.data
        }
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

    const FindKeyByPropertyData = (group, property, value) => {
        const state = ListStates(group)?.find(s => s.data[property] == value)
        if (!state) {
            throw new Error(`State with group ${group.description} and property ${property} with value ${value} does not exist`)
        }
        return state.key
    }

    const ListStates = (group) => {
        return stateList.filter(s => s.group === group)
    }

    const ListStatesByPropertyData = (group, property, value) => {
        const stateList =  ListStates(group)
        const list = stateList.filter(s => s.data[property] == value)
        if (!list) {
            return []
        }
        return list
    }

    const GetDataByKey = (group, key) => {
        const state = GetState(group, key)
        if (!state) {
            return undefined
        }
        return state.data
    }

    return {
        CreateNewState,
        ChangeStatus,
        GetState,
        ListStates,
        ListStatesByPropertyData,
        FindData,
        GetDataByKey,
        onChangeStatus,
        SetData,
        UpdateData,
        FindKeyByPropertyData
    }
}

module.exports = CreateStateManager