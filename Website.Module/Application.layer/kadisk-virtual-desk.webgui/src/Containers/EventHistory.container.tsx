import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

import Table from "../Components/Table"


const EventTable = ({ events }) => {

    const columnsDefinition = {
        Date: "createdAt",
        ID: "id",
        "Event Type": "type",
        "Level": "level",
        "Origin": "origin",
        "Source Name": "sourceName",
        "Message":"message"
    }

    return <div className="table-responsive">
        <Table allTdClassName="p-1" list={events} columnsDefinition={columnsDefinition} />
    </div>
}

const EventHistoryContainer = ({ HTTPServerManager }) => {

    const [ events, setEvents ] = useState()

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
        setEvents(response.data)
    }

    return <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            <EventTable events={events}/>
                        </div>
                    </div>
                </div>
            </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(EventHistoryContainer)
