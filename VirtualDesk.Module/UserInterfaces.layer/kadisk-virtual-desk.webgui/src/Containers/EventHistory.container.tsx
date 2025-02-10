import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

import Table from "../Components/Table"

import CardContainer from "../Components/CardContainer"

const EventTable = ({ events }) => {

    const columnsDefinition = {
        Date: "createdAt",
        ID: "id",
        "Type": "type",
        "Level": "level",
        "Origin": "origin",
        "Source Name": "sourceName",
        "Message": "message"
    }

    return <div className="table-responsive">
        <Table allTdClassName="p-1" list={events} columnsDefinition={columnsDefinition} />
    </div>
}

const EventHistoryContainer = ({ HTTPServerManager }) => {

    const [events, setEvents] = useState()

    useEffect(() => {
        fetchEventHistory()
    }, [])

    const getEventHistoryAPI = () =>
        GetAPI({
            apiName: "EventHistory",
            serverManagerInformation: HTTPServerManager
        })

    const fetchEventHistory = async () => {
        const api = getEventHistoryAPI()
        const response = await api.ListEventHistory()
        setEvents(response.data)
    }

    return <CardContainer>
                <div className="card-body border-bottom py-3">
                    <div className="d-flex">
                        <div className="text-secondary">
                            Show
                            <div className="mx-2 d-inline-block">
                                <input type="text" className="form-control form-control-sm" value="8" />
                            </div>
                            entries
                        </div>
                        <div className="ms-auto text-secondary">
                            Search:
                            <div className="ms-2 d-inline-block">
                                <input type="text" className="form-control form-control-sm" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <EventTable events={events} />
                </div>
                <div className="card-footer d-flex align-items-center">
                    <p className="m-0 text-secondary">Showing <span>1</span> to <span>8</span> of <span>16</span> entries</p>
                    <ul className="pagination m-0 ms-auto">
                      <li className="page-item disabled">
                        <a className="page-link" href="#">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                          prev
                        </a>
                      </li>
                      <li className="page-item"><a className="page-link" href="#">1</a></li>
                      <li className="page-item active"><a className="page-link" href="#">2</a></li>
                      <li className="page-item"><a className="page-link" href="#">3</a></li>
                      <li className="page-item"><a className="page-link" href="#">4</a></li>
                      <li className="page-item"><a className="page-link" href="#">5</a></li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          next
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
                        </a>
                      </li>
                    </ul>
                </div>
            </CardContainer>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(EventHistoryContainer)
