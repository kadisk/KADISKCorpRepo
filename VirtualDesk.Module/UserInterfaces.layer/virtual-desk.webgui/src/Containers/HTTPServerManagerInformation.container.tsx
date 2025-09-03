import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import CardContainer from "../Components/CardContainer"

const GetColorByMethod = (method: string) => {
    switch (method) {
        case "GET":
            return "blue"
        case "POST":
            return "green"
        case "PUT":
            return "orange"
        case "WS":
            return "lime"
        case "DELETE":
            return "red"
        default:
            return "grey"
    }
}

const HTTPServerManagerInformationContainer = ({ HTTPServerManager }) => {

    const [tabIndexSelected, setTabIndexSelected] = useState(0)

    console.log(HTTPServerManager)

    return <CardContainer>
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        {
                            HTTPServerManager.list_web_servers_running
                                .map(({ name, port }, index) => {
                                    return <li className="nav-item">
                                        <a className={`nav-link ${index === tabIndexSelected ? "active" : ""}`}>[<strong>{" " + port}</strong>] {name}</a>
                                    </li>
                                })
                        }
                    </ul>
                </div>
                <div className="card-body">
                    <div className="row row-cards">
                        {
                            HTTPServerManager.list_web_servers_running[0]
                                .listServices
                                .map((serviceData) => {
                                    return <div className="col-12">
                                        <div className="card bg-dark-lt">
                                            <div className="card-header py-2">
                                                <h3 className="card-title"><strong>{serviceData.path} </strong><span className="card-subtitle">{serviceData.type}</span></h3>
                                            </div>
                                            <div className="card-body">
                                                {
                                                    serviceData.staticDir
                                                    && <>
                                                        <div className="page-pretitle">Static Directory</div>
                                                        <div>{serviceData.staticDir}</div>
                                                    </>
                                                }
                                                {
                                                    serviceData.serviceName
                                                    && <>
                                                        <div className="page-pretitle">Service Name</div>
                                                        <div>{serviceData.serviceName}</div>
                                                    </>
                                                }
                                            </div>
                                            {
                                                serviceData.apiTemplate
                                                && <div className="card-body">
                                                    <div className="col-12">
                                                        <div className="card">
                                                            <div className="card-body py-2">
                                                                <span className="page-pretitle">API Template Name</span>
                                                                <div><strong>{serviceData.apiTemplate.name}</strong></div>
                                                            </div>
                                                            <div className="card-body">
                                                                <span className="page-pretitle">Endpoints</span>
                                                                <div className="card bg-gray-400">
                                                                    <div className="table-responsive">
                                                                        <table className="table table-vcenter">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Summary</th>
                                                                                    <th>URL</th>
                                                                                    <th></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    serviceData.apiTemplate.endpoints
                                                                                        .map((endpointData) => {

                                                                                            const {
                                                                                                summary,
                                                                                                method,
                                                                                                path,
                                                                                                parameters
                                                                                            } = endpointData

                                                                                            return <tr>
                                                                                                <td className="p-2"><strong>{summary}</strong></td>
                                                                                                <td className="p-2"><span className={`badge bg-${GetColorByMethod(method)} text-${GetColorByMethod(method)}-fg`} style={{ fontSize: ".7em" }}>{method}</span> {path}</td>
                                                                                                <td className="p-2">
                                                                                                    {
                                                                                                        parameters
                                                                                                        && <div className="card bg-dark-lt">
                                                                                                            <div className="table-responsive">
                                                                                                                <table className="table">
                                                                                                                    <thead>
                                                                                                                        <tr>
                                                                                                                            <th className="p-1">Name</th>
                                                                                                                            <th className="p-1">In</th>
                                                                                                                            <th className="p-1">Type</th>
                                                                                                                            <th className="p-1">Required</th>
                                                                                                                        </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody>
                                                                                                                        {
                                                                                                                            parameters
                                                                                                                                .map((paramData) => {

                                                                                                                                    /*const {
                                                                                                                                        name, in, type, required
                                                                                                                                    } = paramData*/

                                                                                                                                    return <tr>
                                                                                                                                        <td className="p-1">{paramData.name}</td>
                                                                                                                                        <td className="p-1">{paramData.in}</td>
                                                                                                                                        <td className="p-1">{paramData.type}</td>
                                                                                                                                        <td className="p-1"><input className="form-check-input m-0 align-middle" type="checkbox" checked={paramData.required} /></td>
                                                                                                                                    </tr>
                                                                                                                                })
                                                                                                                        }

                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    }

                                                                                                </td>
                                                                                            </tr>
                                                                                        })
                                                                                }
                                                                                {
                                                                                    serviceData.summariesNotFound
                                                                                        .map((summary) => {
                                                                                            return <tr className="text-danger"><td colSpan={4} className="p-2"><strong>{summary}</strong></td></tr>
                                                                                        })
                                                                                }

                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            }

                                        </div>
                                    </div>
                                })
                        }
                    </div>
                </div>
            </CardContainer>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(HTTPServerManagerInformationContainer)
