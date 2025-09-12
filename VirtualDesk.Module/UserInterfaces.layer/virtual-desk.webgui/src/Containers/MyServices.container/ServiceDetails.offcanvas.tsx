import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import { JsonEditor, monoLightTheme } from 'json-edit-react'
import Ajv from "ajv"

import GetAPI from "../../Utils/GetAPI"

import useWebSocket from "../../Hooks/useWebSocket"

const GetColor = (status: string) => {
    switch (status) {
        case "RUNNING":
            return "green"
		case "FINISHED":
            return "cyan"
        case "FAILURE":
            return "red"
        case "TERMINATED":
			return "gray"
        case "STOPPED":
			return "orange"
		case "STARTING":
        case "RESTARTING":
		case  "CREATED":
			return "azure"
		case "STOPPING":
			return "yellow"
		case "WAITING":
		case "LOADING":
            return "purple"
        default:
            return "gray"
    }
}

const ServiceDetailsOffcanvas = ({
    serviceId,
    onCloseServiceDetails,
    HTTPServerManager,
}) => {

    const [ isUpdatePortsMode , setIsUpdatePortsMode ] = useState(false)
    const [ isUpdateStartupParamsMode , setIsUpdateStartupParamsMode ] = useState(false)

    const [ serviceData, setServiceData ] = useState<any>()
    const [ status, setStatus ] = useState("PENDING")
    const [ networksSettings, setNetworksSettings ] = useState<any>()
    const [ instanceStartupParams, setInstanceStartupParams ] = useState<any>()
    const [ startupParamsSchema, setStartupParamsSchema ] = useState<any>()
    
    const startupParamsValidate = useRef(null)

    const [ instancePortsBinding, setInstancePortsBinding ] = useState([])
    const [ newInstancePortsForBinding, setNewInstancePortsForBinding ] = useState<any[]>()
    const [ networkMode, setNetworkMode ] = useState()

    const [ newStartupParamsForUpdate, setNewStartupParamsForUpdate ] = useState<any>()

    const [ servicePortForAdd, setServicePortForAdd ] = useState<string>("")
    const [ hostPortForAdd, setHostPortForAdd ] = useState<string>("")


    useEffect(() => {
        setIsUpdatePortsMode(false)
        setInstancePortsBinding([])
        setServicePortForAdd("")
        setHostPortForAdd("")
        fetchStatus()
    }, [serviceId])

    useEffect(() => {
        if(status && status !== "PENDING"){
            fetchServiceData()
            fetchNetworksSettings()
            fetchInstanceStartupParams()
            fetchNetworkMode()
        }
        
    }, [status])

    useEffect(() => {
        if(isUpdateStartupParamsMode){
            fetchInstanceStartupParamsSchema()
        }else {
            startupParamsValidate.current = undefined
        }
    }, [isUpdateStartupParamsMode])

    const getMyServicesManagerAPI = () =>
		GetAPI({
			apiName: "MyServicesManager",
			serverManagerInformation: HTTPServerManager
		})

    const updateServiceStatus = ({serviceId, status}) => {
		if (serviceId !== serviceId) return
		setStatus(status)
    }

    useWebSocket({
		socket          : getMyServicesManagerAPI().ServicesStatusChange,
		onMessage       : updateServiceStatus,
		onConnection    : () => {},
		onDisconnection : () => {}
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

    const fetchInstanceStartupParamsSchema = async () => {
        
        const api = getMyServicesManagerAPI()
        const response = await api.GetInstanceStartupParamsSchema({ serviceId })

        const schema = response.data
        const ajv = new Ajv()
        try {
            const validate = ajv.compile(schema)
            startupParamsValidate.current = validate
        } catch (e) {
            console.error(e)
            startupParamsValidate.current = undefined
        } finally{
            setStartupParamsSchema(schema)
        }
    }

    const fetchNetworksSettings = async () => {
        setNetworksSettings(undefined)
        const api = getMyServicesManagerAPI()
        const response = await api.GetNetworksSettings({ serviceId })
        setNetworksSettings(response.data)
        setInstancePortsBinding([])
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
        resetPorts()
        setIsUpdatePortsMode(false)
        setInstancePortsBinding([])
    }

    const handleCancelUpdateStartupParams = () => {
        setIsUpdateStartupParamsMode(false)
    }

    const resetPorts = () => {
        setNewInstancePortsForBinding(undefined)
        setServicePortForAdd("")
        setHostPortForAdd("")
    }

    const closeStartupParamsMode = () => {
        setIsUpdateStartupParamsMode(false)
        setStartupParamsSchema(undefined)
        setNewStartupParamsForUpdate(undefined)
    }

    const handleResetEditPorts = () => resetPorts()

    const handleUpdatePorts = async () => {
        const api = getMyServicesManagerAPI()
		const response = await api.UpdateServicePorts({ serviceId, ports: newInstancePortsForBinding })
        resetPorts()
        setIsUpdatePortsMode(false)
        setInstancePortsBinding(undefined)
    }

    const handleUpdateStartupParams = async () => {
        const api = getMyServicesManagerAPI()
		const response = await api.UpdateServiceStartupParams({ serviceId, startupParams: newStartupParamsForUpdate })
        closeStartupParamsMode()
    }

    const handleUpdateStartupParamsMode = () => {
        setIsUpdateStartupParamsMode(true)
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

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
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
                {
                    status == "RESTARTING" && <div className="justify-content-center row my-4"><div className="spinner-border"></div></div>
                }
                {
                    status !== "RESTARTING" && 
                    <div className="offcanvas-body">
                        <p>{serviceData?.serviceDescription}</p>
                        <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">General information</div>
                        <dl className="row">
                            <dt className="col-5">package:</dt>
                            <dd className="col-7">{serviceData?.packageName}</dd>
                            <dt className="col-5">type:</dt>
                            <dd className="col-7">{serviceData?.originPackageType}</dd>
                            <dt className="col-5">repository namespace:</dt>
                            <dd className="col-7">{serviceData?.originRepositoryNamespace}</dd>
                        </dl>
                        <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Instance Startup Params</div>
                        {
                            instanceStartupParams
                            && isUpdateStartupParamsMode
                            && startupParamsValidate.current
                            && <JsonEditor
                                    data={ instanceStartupParams }
                                    theme={monoLightTheme}
                                    setData={ setNewStartupParamsForUpdate }
                                    onUpdate={ ({ newData }) => {
                                        const valid = startupParamsValidate.current(newData)
                                        if (!valid) {
                                            return 'JSON Schema error'
                                        }
                                    }}/>
                        }
                        {

                            instanceStartupParams
                            && !isUpdateStartupParamsMode
                            && <>
                                <div className="table-responsive bg-gray-100">
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
                                                        <td className="p-1">{JSON.stringify(instanceStartupParams[property])}</td>
                                                    </tr>)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        }

                        <div className="btn-list justify-content-end p-2">
                            {
                                !isUpdateStartupParamsMode
                                && <a className="btn btn-azure" onClick={() => handleUpdateStartupParamsMode()}>
                                        change startup params
                                    </a>
                            }
                            {
                                isUpdateStartupParamsMode
                                && <>
                                        <button className="btn btn-secondary" onClick={() => handleCancelUpdateStartupParams()}>
                                            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-cancel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M18.364 5.636l-12.728 12.728" /></svg>
                                            cancel
                                        </button>
                                        <button className="btn btn-orange" disabled={!newStartupParamsForUpdate} onClick={() => handleUpdateStartupParams()}>
                                            update
                                        </button>
                                    </>
                            }
                        </div>
                        
                        {
                            networkMode !== "none" && networkMode !== "host"
                            && <>

                                    <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Ports</div>
                                        {
                                            !isUpdatePortsMode
                                            && networksSettings
                                            && Object.keys(networksSettings.ports).length > 0
                                            && instancePortsBinding
                                            && <>
                                                    {
                                                        Object.keys(networksSettings.ports).length > 0
                                                        && <div className="table-responsive bg-gray-100">
                                                                <table className="table table-vcenter card-table text-center">
                                                                    <thead>
                                                                        <tr>
                                                                            <th  className="p-1" rowSpan={2}><strong>service port</strong></th>
                                                                            <th  className="p-1" colSpan={2}><strong>host</strong></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="p-1" ><strong>ip</strong></th>
                                                                            <th className="p-1" ><strong>port</strong></th>
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
                                                    }
                                                        
                                            </>
                                        }

                                        { isUpdatePortsMode &&
                                            <div className="card bg-orange-lt">
                                                <div className="card-body">
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
                                                
                                            </div>
                                        }
                                        {
                                            instancePortsBinding
                                            && <div className="card-footer p-2">
                                                    <div className="btn-list justify-content-end">
                                                        {
                                                            !isUpdatePortsMode
                                                            && <a className="btn btn-azure" onClick={() => handleUpdatePortsMode()}>
                                                                    change ports
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
                                                                        update
                                                                    </button>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                        }
                            </>
                        }
                        
                        {
                            networksSettings
                            && networksSettings.networks.length > 0
                            && <>
                                    <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Networks</div>
                                    {
                                        networksSettings.networks.length > 0
                                        && <div className="table-responsive bg-gray-100">
                                                <table className="table table-vcenter card-table text-center">
                                                    <thead>
                                                        <tr>
                                                            <th className="p-1" ><strong>Name</strong></th>
                                                            <th className="p-1" ><strong>IP Address</strong></th>
                                                            <th className="p-1" ><strong>Gateway</strong></th>
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
                                    }
                                        
                            </>
                        }
                    </div>
                }
                
            </div>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetailsOffcanvas)