import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

const NotificationHistoryContainer = ({ HTTPServerManager }) => {

    useEffect(() => {
            fetchNotificationHistory()
    }, [])

    const getNotificationHistoryAPI = () => 
        GetAPI({ 
            apiName:"NotificationHistory",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchNotificationHistory = async () => {
        const api = getNotificationHistoryAPI()
        const response = await api.ListNotificationHistory()
    }

    return <></>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(NotificationHistoryContainer)
