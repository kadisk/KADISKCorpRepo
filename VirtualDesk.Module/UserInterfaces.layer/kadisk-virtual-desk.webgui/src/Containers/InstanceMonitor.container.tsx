import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

const InstanceMonitorContainer = ({ HTTPServerManager, socketFileId }) => {

    useEffect(() => {
        fetchInstanceMonitorData()
    }, [])
    
    const _GetInstanceMonitoringAPI = () =>
        GetAPI({
            apiName: "InstanceMonitoring",
            serverManagerInformation: HTTPServerManager
        })

    const fetchInstanceMonitorData = async () => {
        const api = _GetInstanceMonitoringAPI()
        const response = await api.GetInstanceMonitorData({socketFileId})
    }

    return <>
        <div className="page-header d-print-none">
            <div className="container">
                <div className="row g-3">
                    <div className="col">
                        <h2 className="page-title">
                            tabler.io/icons
                        </h2>
                        <div className="text-secondary">
                            <ul className="list-inline list-inline-dots mb-0">
                                <li className="list-inline-item"><span className="text-green">Up</span></li>
                                <li className="list-inline-item">Checked every 3 minutes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="page-body">
            <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="subheader">Currently up for</div>
                                <div className="h3 m-0">14 days 2 hours 54 mins 34 seconds</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="subheader">Last checked at</div>
                                <div className="h3 m-0">27 seconds ago</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="subheader">Incidents</div>
                                <div className="h3 m-0">3</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card">
                            <div className="card-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Time period</th>
                                            <th>Availability</th>
                                            <th>Downtime</th>
                                            <th>Incidents</th>
                                            <th>Longest incident</th>
                                            <th>Avg. incident</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr>
                                        <td>Today</td>
                                        <td>98.9533%</td>
                                        <td>1 minute</td>
                                        <td>1</td>
                                        <td>1 minute</td>
                                        <td>1 minute</td>
                                    </tr>
                                        <tr>
                                            <td>Last 7 days</td>
                                            <td>98.9533%</td>
                                            <td>1 minute</td>
                                            <td>1</td>
                                            <td>1 minute</td>
                                            <td>1 minute</td>
                                        </tr>
                                        <tr>
                                            <td>Last 30 days</td>
                                            <td>98.9533%</td>
                                            <td>1 minute</td>
                                            <td>1</td>
                                            <td>1 minute</td>
                                            <td>1 minute</td>
                                        </tr>
                                        <tr>
                                            <td>Last 365 days</td>
                                            <td>98.9533%</td>
                                            <td>1 minute</td>
                                            <td>1</td>
                                            <td>1 minute</td>
                                            <td>1 minute</td>
                                        </tr>
                                        <tr>
                                            <td>All time</td>
                                            <td>98.9533%</td>
                                            <td>1 minute</td>
                                            <td>1</td>
                                            <td>1 minute</td>
                                            <td>1 minute</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(InstanceMonitorContainer)
