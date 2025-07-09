import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const GetColor = (status: string) => {
    switch (status) {
        case "RUNNING":
            return "green"
        case "STARTING":
            return "cyan"
        case "FAILURE":
            return "red"
        case "TERMINATED":
        case "STOPPED":
        case "LOADED":
            return "yellow"
        default:
            return "orange"
    }
}

const ServiceDetailsOffcanvas = ({
    serviceId,
    onCloseServiceDetails,
    HTTPServerManager,
}) => {

    const [ serviceData, setServiceData ] = useState<any>()
    const [ status, setStatus ] = useState("PENDING")
    const [ networksSettings, setNetworksSettings ] = useState<any>()
    const [ instanceStartupParams, setInstanceStartupParams ] = useState<any>()

    useEffect(() => {
        fetchServiceData()
        fetchStatus()
        fetchNetworksSettings()
        fetchInstanceStartupParams()
    }, [])


    const getMyServicesManagerAPI = () =>
		GetAPI({
			apiName: "MyServicesManager",
			serverManagerInformation: HTTPServerManager
		})

        
    const fetchStatus = async () => {
		const api = getMyServicesManagerAPI()
		const response = await api.GetServiceStatus({ serviceId })
        setStatus(response.data)
	}

	const fetchServiceData = async () => {
		const api = getMyServicesManagerAPI()
		const response = await api.GetServiceData({ serviceId })
        setServiceData(response.data)
	}

    const fetchNetworksSettings = async () => {
        const api = getMyServicesManagerAPI()
        const response = await api.GetNetworksSettings({ serviceId })
        setNetworksSettings(response.data)
    }

    const fetchInstanceStartupParams = async () => {
        const api = getMyServicesManagerAPI()
        const response = await api.GetInstanceStartupParamsData({ serviceId })
        setInstanceStartupParams(response.data)
    }

    return <div className="offcanvas offcanvas-end show" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <span className={`status-indicator status-${GetColor(status)} status-indicator-animated`}>
                            <span className="status-indicator-circle"></span>
                            <span className="status-indicator-circle"></span>
                            <span className="status-indicator-circle"></span>
                            </span>
                        </div>
                        <div className="col">
                            <h2 className="page-title">{serviceData?.serviceName}</h2>
                            <div className="text-secondary">
                            <ul className="list-inline list-inline-dots mb-0">
                                <li className="list-inline-item"><span className={`text-${GetColor(status)}`}>{status}</span></li>
                                
                            </ul>
                            </div>
                        </div>
                        </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onCloseServiceDetails()}></button>
                </div>
                <div className="offcanvas-body">
                    <p>{serviceData?.serviceDescription}</p>
                    <div className="hr-text hr-text-center hr-text-spaceless my-3">General information</div>
                    <dl className="row">
                        <dt className="col-5">package:</dt>
                        <dd className="col-7">{serviceData?.packageName}</dd>
                        <dt className="col-5">type:</dt>
                        <dd className="col-7">{serviceData?.packageType}</dd>
                        <dt className="col-5">repository namespace:</dt>
                        <dd className="col-7">{serviceData?.repositoryNamespace}</dd>
                    </dl>
                    {

                        instanceStartupParams
                        && <>
                            <div className="hr-text hr-text-center hr-text-spaceless my-3">Instance Startup Params</div>
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-vcenter card-table">
                                        <thead>
                                            <tr>
                                                <th className="p-1" >Parameter</th>
                                                <th className="p-1" >Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(instanceStartupParams)
                                                .map((property) => 
                                                    <tr>
                                                        <td className="p-1"><strong>{property}</strong></td>
                                                        <td className="p-1">{instanceStartupParams[property]}</td>
                                                    </tr>)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    }
                    {
                        networksSettings
                        && Object.keys(networksSettings.ports).length > 0
                        && <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3">Ports</div>
                                {
                                    Object.keys(networksSettings.ports).length > 0
                                    && <div className="card">
                                            <div className="table-responsive">
                                                <table className="table table-vcenter card-table text-center">
                                                    <thead>
                                                        <tr>
                                                            <th  className="p-1" rowSpan={2}>service port</th>
                                                            <th  className="p-1" colSpan={2}>host</th>
                                                        </tr>
                                                        <tr>
                                                            <th className="p-1" >ip</th>
                                                            <th className="p-1" >port</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(networksSettings.ports)
                                                            .map((servicePort, index) => {
                                                                const hostMap = networksSettings.ports[servicePort]
                                                                return hostMap.map((host, hostIndex) => {
                                                                        return <tr>
                                                                                    {hostIndex === 0 && <td className="p-1" rowSpan={hostMap.length}>{servicePort}</td>}
                                                                                    <td className="p-1">{host.HostIp}</td>
                                                                                    <td className="p-1">{host.HostPort}</td>
                                                                                </tr>
                                                                    })
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                }
                                    
                        </>
                    }
                    {
                        networksSettings
                        && networksSettings.networks.length > 0
                        && <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3">Networks</div>
                                {
                                    networksSettings.networks.length > 0
                                    && <div className="card">
                                            <div className="table-responsive">
                                                <table className="table table-vcenter card-table text-center">
                                                    <thead>
                                                        <tr>
                                                            <th className="p-1" >Name</th>
                                                            <th className="p-1" >IP Address</th>
                                                            <th className="p-1" >Gateway</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            networksSettings.networks
                                                            .map(({name, ipAddress, gateway}, index) => 
                                                                <tr>
                                                                    <td className="p-1"><strong>{name}</strong></td>
                                                                    <td className="p-1">{ipAddress}</td>
                                                                    <td className="p-1">{gateway}</td>
                                                                </tr>)
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                }
                                    
                        </>
                    }
                </div>
            </div>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetailsOffcanvas)