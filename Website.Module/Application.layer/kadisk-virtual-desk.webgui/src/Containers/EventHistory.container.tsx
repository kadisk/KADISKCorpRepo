import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

const EventHistoryContainer = ({ HTTPServerManager }) => {

    useEffect(() => {
            fetchEventHistory()
    }, [])

    const getEventHistoryAPI = () => 
        GetAPI({ 
            apiName:"EventHistory",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchEventHistory = async () => {
        const api = getEventHistoryAPI()
        const response = await api.ListEventHistory()
    }

    return <></>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(EventHistoryContainer)
