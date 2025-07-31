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
        case "FINISHED":
        case "STOPPED":
            return "gray"
        case "WAITING":
		case "LOADING":
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

    const [ isUpdatePortsMode , setIsUpdatePortsMode ] = useState(false)
    const [ instancePortsBinding, setInstancePortsBinding ] = useState([])
    const [ newInstancePortsForBinding, setNewInstancePortsForBinding ] = useState<any[]>()
    const [ networkMode, setNetworkMode ] = useState()

    const [ servicePortForAdd, setServicePortForAdd ] = useState<string>("")
    const [ hostPortForAdd, setHostPortForAdd ] = useState<string>("")

    

    useEffect(() => {
        setIsUpdatePortsMode(false)
        setInstancePortsBinding([])
        setServicePortForAdd("")
        setHostPortForAdd("")
        fetchServiceData()
        fetchStatus()
        fetchNetworksSettings()
        fetchInstanceStartupParams()
        fetchNetworkMode()
    }, [serviceId])


    const getMyServicesManagerAPI = () =>
		GetAPI({
			apiName: "MyServicesManager",
			serverManagerInformation: HTTPServerManager
		})

        
    const fetchStatus = async () => {
        setStatus(undefined)
		const api = getMyServicesManagerAPI()
		const response = await api.GetServiceStatus({ serviceId })
        setStatus(response.data)
	}

	const fetchServiceData = async () => {
        setServiceData(undefined)
		const api = getMyServicesManagerAPI()
		const response = await api.GetServiceData({ serviceId })
        setServiceData(response.data)
	}

    const fetchNetworksSettings = async () => {
        setNetworksSettings(undefined)
        const api = getMyServicesManagerAPI()
        const response = await api.GetNetworksSettings({ serviceId })
        setNetworksSettings(response.data)
    }

    const fetchInstanceStartupParams = async () => {
        setInstanceStartupParams(undefined)
        const api = getMyServicesManagerAPI()
        const response = await api.GetInstanceStartupParamsData({ serviceId })
        setInstanceStartupParams(response.data)
    }

    const fetchNetworkMode = async () => {
        setNetworkMode(undefined)
        const api = getMyServicesManagerAPI()
        const response = await api.GetNetworkModeData({ serviceId })
        setNetworkMode(response.data)
    }

    const handleUpdatePortsMode = async () => {
        const api = getMyServicesManagerAPI()
        const response = await api.GetInstancePortsData({ serviceId })
        setInstancePortsBinding(response.data)
        setIsUpdatePortsMode(true)
    }


    const handleCancelUpdatePorts = () => {
        reset()
        setIsUpdatePortsMode(false)
        setInstancePortsBinding([])
    }

    const reset = () => {
        setNewInstancePortsForBinding(undefined)
        setServicePortForAdd("")
        setHostPortForAdd("")
    }

    const handleResetEditPorts = () => reset()

    const handleUpdatePorts = async () => {
        const api = getMyServicesManagerAPI()
		const response = await api.UpdateServicePorts({ serviceId, ports: newInstancePortsForBinding })

        console.log(response.data)
    }

    const handleAddNewPort = () => {
        if (!servicePortForAdd || !hostPortForAdd) return

        const newPorts = [
            ...(newInstancePortsForBinding || instancePortsBinding),
            {
                servicePort: servicePortForAdd,
                hostPort: hostPortForAdd
            }
        ]
        setNewInstancePortsForBinding(newPorts)
        setServicePortForAdd("")
        setHostPortForAdd("")
    }

    const handleRemovePort = (index) => {
        const newPorts = [...(newInstancePortsForBinding || instancePortsBinding)]
        newPorts.splice(index, 1)
        setNewInstancePortsForBinding(newPorts)
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
                        networkMode !== "none" && networkMode !== "host"
                        && <>

                                <div className="hr-text hr-text-center hr-text-spaceless my-3">Ports</div>
                                    {
                                        !isUpdatePortsMode
                                        && networksSettings
                                        && Object.keys(networksSettings.ports).length > 0
                                        && <>
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

                                    { isUpdatePortsMode &&
                                        <div className="card bg-orange-lt">
                                            <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Service Port</th>
                                                            <th>Host Port</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            (newInstancePortsForBinding || instancePortsBinding)
                                                            .map((port, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <strong>{port.servicePort}</strong>/tcp
                                                                    </td>
                                                                    <td>
                                                                        <strong>{port.hostPort}</strong>/tcp
                                                                    </td>
                                                                    <td>
                                                                        <button 
                                                                            onClick={() => handleRemovePort(index)}
                                                                            className="btn btn-ghost-secondary btn-table">
                                                                            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus m-0"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l6 0" /></svg>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                        <tr>
                                                            <td>
                                                                <input 
                                                                    placeholder="Service Port" 
                                                                    type="number" 
                                                                    value={servicePortForAdd}
                                                                    className="form-control" 
                                                                    style={{ maxWidth: '120px' }}
                                                                    onChange={e => setServicePortForAdd(e.target.value)}/>
                                                            </td>
                                                            <td>
                                                                <input 
                                                                    placeholder="Host Port" 
                                                                    type="number" 
                                                                    value={hostPortForAdd}
                                                                    className="form-control" 
                                                                    style={{ maxWidth: '120px' }}
                                                                    onChange={e => setHostPortForAdd(e.target.value)}/>
                                                            </td>
                                                            <td>
                                                                <button 
                                                                    className="btn btn-primary btn-table" 
                                                                    disabled={!(servicePortForAdd && hostPortForAdd)}
                                                                    onClick={() => handleAddNewPort()}>
                                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus m-0"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    }

                                    <div className="card-footer p-2">
                                        <div className="btn-list justify-content-end">
                                            {
                                                !isUpdatePortsMode
                                                && <a className="btn btn-secondary" onClick={() => handleUpdatePortsMode()}>
                                                        <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                                                        edit ports
                                                    </a>
                                            }
                                            {
                                                isUpdatePortsMode
                                                && <>
                                                        <button className="btn btn-secondary" onClick={() => handleCancelUpdatePorts()}>
                                                            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-cancel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M18.364 5.636l-12.728 12.728" /></svg>
                                                            cancel
                                                        </button>
                                                        <button className="btn btn-secondary" disabled={!newInstancePortsForBinding} onClick={() => handleResetEditPorts()}>
                                                            reset
                                                        </button>
                                                        <button className="btn btn-orange" disabled={!newInstancePortsForBinding} onClick={() => handleUpdatePorts()}>
                                                            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-pencil-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /><path d="M15 19l2 2l4 -4" /></svg>
                                                            update
                                                        </button>
                                                    </>
                                            }
                                        </div>
                                    </div>
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