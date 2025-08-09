import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import useWebSocket from "../../Hooks/useWebSocket"

const GetColorByStatus = (status: string) => {
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
		case "RESTARTING":
		case  "CREATED":
		case "STARTING":
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

const isShowStatusDotAnimated = (status) => {

	if(
		status==="LOADING"
		|| status==="RUNNING"
		|| status==="STOPPING"
		|| status==="RESTARTING"
		|| status==="CREATED"
		|| status==="STARTING"
	) return true

	return false
}

const INITIAL_PROVISIONED_SERVICE = {
    "serviceId": undefined,
    "serviceName": "",
    "serviceDescription": "",
    "repositoryId": undefined,
    "repositoryNamespace": "",
    "packageId": undefined,
    "packageName": "",
    "packageType": ""
}

const START_ICON     = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
const RESTART_ICON   = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
const STOP_ICON      = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>
const SETTINGS_ICON  = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12a9 9 0 1 0 -8.979 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a16.992 16.992 0 0 1 2.522 10.376" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>
const WORLD_OFF_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.657 5.615a9 9 0 1 0 12.717 12.739m1.672 -2.322a9 9 0 0 0 -12.066 -12.084" /><path d="M3.6 9h5.4m4 0h7.4" /><path d="M3.6 15h11.4m4 0h1.4" /><path d="M11.5 3a17.001 17.001 0 0 0 -1.493 3.022m-.847 3.145c-.68 4.027 .1 8.244 2.34 11.833" /><path d="M12.5 3a16.982 16.982 0 0 1 2.549 8.005m-.207 3.818a16.979 16.979 0 0 1 -2.342 6.177" /><path d="M3 3l18 18" /></svg>

const ServiceSettingsPanelContainer = ({
	HTTPServerManager,
	serviceId
}) => {

	const [ serviceData, setServiceData ] = useState(INITIAL_PROVISIONED_SERVICE)

	const [ instances, setInstance ]                  = useState([])
	const [ containers, setContainers ]               = useState([])
	const [ imageBuildHistory, setImageBuildHistory ] = useState([])

	const [ serviceStatus, setServiceStatus ] = useState("")

	const {
		serviceName,
		repositoryNamespace,
		packageName,
		packageType
	} = serviceData

	useEffect(() => {
		fetchServiceData()
		fetchInstances()
		fetchContainers()
		fetchServiceStatus()
		fetchImageBuildHistory()
	}, [])

	const _MyServicesAPI = () =>
		GetAPI({
			apiName: "MyServicesManager",
			serverManagerInformation: HTTPServerManager
		})


	const updateServiceStatus = ({serviceId, status}) => {
		if (serviceId !== serviceId) return
		setServiceStatus(status)
    }

    useWebSocket({
		socket          : _MyServicesAPI().ServicesStatusChange,
		onMessage       : updateServiceStatus,
		onConnection    : () => {},
		onDisconnection : () => {}
	})

	const instanceListSocketHandler = useWebSocket({
		socket          : _MyServicesAPI().InstanceListChange,
		onMessage       : (instances) => setInstance(instances),
		onConnection    : () => {},
		onDisconnection : () => {},
		autoConnect     : false    
	})

	const containerListSocketHandler = useWebSocket({
		socket          : _MyServicesAPI().ContainerListChange,
		onMessage       : (containers) => setContainers(containers),
		onConnection    : () => {},
		onDisconnection : () => {},
		autoConnect     : false    
	})

	const imageBuildListSocketHandler = useWebSocket({
		socket          : _MyServicesAPI().ImageBuildHistoryListChange,
		onMessage       : (imageBuildList) => setImageBuildHistory(imageBuildList),
		onConnection    : () => {},
		onDisconnection : () => {},
		autoConnect     : false    
	})

	useEffect(() => {
		if(serviceData.serviceId){
			
			if(!instanceListSocketHandler.isConneted())
				instanceListSocketHandler.connect({ serviceId: serviceData.serviceId })
			
			if(!containerListSocketHandler.isConneted())
				containerListSocketHandler.connect({ serviceId: serviceData.serviceId })

			if(!imageBuildListSocketHandler.isConneted())
				imageBuildListSocketHandler.connect({ serviceId: serviceData.serviceId })
		}
	}, [serviceData.serviceId])

	const fetchServiceStatus = async () => {
		const api = _MyServicesAPI()
		const response = await api.GetServiceStatus({ serviceId })
		setServiceStatus(response.data)
	}

	const fetchServiceData = async () => {
		const api = _MyServicesAPI()
		const response = await api.GetServiceData({ serviceId })

		setServiceData(response.data)
	}

	const fetchInstances = async () => {
		setInstance([])
		const api = _MyServicesAPI()
		const response = await api.ListInstances({ serviceId })
		setInstance(response.data)
	}

	const fetchContainers = async () => {
		setContainers([])
		const api = _MyServicesAPI()
		const response = await api.ListContainers({ serviceId })
		setContainers(response.data)
	}

	const fetchImageBuildHistory = async () => {
		setImageBuildHistory([])
		const api = _MyServicesAPI()
		const response = await api.ListImageBuildHistory({ serviceId })
		setImageBuildHistory(response.data)
	}

	const startService = async () => {
        const api = _MyServicesAPI()
        await api.StartService({serviceId})
    }

	const stopService = async () => {
        const api = _MyServicesAPI()
        await api.StopService({serviceId})
    }

	const handleChangeStartupParamsMode = async () => {
		
	}

	return <>
		<div className="container-xl">
			<div>
				<div className="row g-3 align-items-center">
					<div className="col">
						<div className="page-pretitle">Service Settings</div>
						<h2 className="page-title">{serviceName}</h2>
						<div className="text-secondary mt-3">
							<ul className="list-inline list-inline-dots mb-0">
								<li className="list-inline-item">
									<span className={`status status-${GetColorByStatus(serviceStatus)}`}>
										<span className={isShowStatusDotAnimated(serviceStatus) ? "status-dot status-dot-animated":""}></span>
										{serviceStatus}
									</span>
								</li>
								<li className="list-inline-item">{repositoryNamespace}/{packageName}/{packageType}</li>
							</ul>
						</div>
					</div>
					<div className="col-auto ms-auto d-print-none">
						<div className="btn-list">
							{
								( serviceStatus === "STOPPED"
								|| serviceStatus === "TERMINATED" )
								&& <button className="btn btn-primary" onClick={() => startService()}>
										{START_ICON}start
									</button>
							}
							{
								serviceStatus === "RUNNING"
								&& <>
										<a className="btn btn-secondary" onClick={() => handleChangeStartupParamsMode()}>
											change startup params
										</a>
										<button className="btn btn-danger" onClick={() => stopService()}>
											{STOP_ICON}stop
										</button>
									</>
							}
						</div>
					</div>
				</div>
				<div className="row row-cards mt-0">
					<div className="col-12">
						<div className="card">
							<div className="card-header p-2">
								<div className="subheader">Instances</div>
							</div>
							<div className="card-body p-0">
								<div className="card-table table-responsive table-vcenter">
									<table className="table">
										<thead>
											<tr>
												<th>Status</th>
												<th>ID</th>
												<th>Network Mode</th>
												<th>Ports</th>
												<th>Startup Params</th>
											</tr>
										</thead>
										<tbody>
											{instances.length === 0 ? (
												<tr>
													<td colSpan={5} className="text-center">No instances found.</td>
												</tr>
											) : (
												instances.map((item: any) => (
													<tr>
														<td>
															<span className={`status status-${GetColorByStatus(item.status)}`}>
																<span className={isShowStatusDotAnimated(item.status) ? "status-dot status-dot-animated":""}></span>
																{item.status}
															</span>
														</td>
														<td>{item.instanceId}</td>
														<td>{item.networkmode}</td>
														<td style={{ whiteSpace: "nowrap" }}>
															{item.ports.map((port) =>
																<div className="d-flex mb-1">
																	<div className="me-2 text-secondary text-nowrap">
																		{"Service ".toUpperCase()}<span className="badge">{`${port.servicePort}`}</span>
																	</div>
																	<div className="text-nowrap">
																		<strong>{"Host ".toUpperCase()}<span className="badge badge-outline text-dark"><strong>{`${port.hostPort}`}</strong></span></strong>
																	</div>
																</div>
															)}
														</td>
														<td>{JSON.stringify(item.startupParams, null, 2)}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row row-cards mt-2">
					<div className="col-12">
						<div className="card">
							<div className="card-header p-2">
								<div className="subheader">Containers</div>
							</div>
							<div className="card-body p-0">
								<div className="card-table table-responsive table-vcenter">
									<table className="table">
										<thead>
											<tr>
												<th>Status</th>
												<th>ID</th>
												<th>Container Name</th>
											</tr>
										</thead>
										<tbody>
											{containers.length === 0 ? (
												<tr>
													<td colSpan={3} className="text-center">No containers found.</td>
												</tr>
											) : (
												containers.map((item: any) => (
													<tr>
														<td>
															<span className={`status status-${GetColorByStatus(item.status)}`}>
																<span className={isShowStatusDotAnimated(item.status) ? "status-dot status-dot-animated":""}></span>
																{item.status}
															</span>
														</td>
														<td>{item.containerId}</td>
														<td>{item.containerName}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row row-cards mt-2">
					<div className="col-12">
						<div className="card">
							<div className="card-header p-2">
								<div className="subheader">Image Build Histories</div>
							</div>
							<div className="card-body p-0">
								<div className="card-table table-responsive table-vcenter">
									<table className="table">
										<thead>
											<tr>
												<th>Status</th>
												<th>ID</th>
												<th>Tag/Hash</th>
											</tr>
										</thead>
										<tbody>
											{imageBuildHistory.length === 0 ? (
												<tr>
													<td colSpan={3} className="text-center">No build history found.</td>
												</tr>
											) : (
												imageBuildHistory.map((item: any) => (
													<tr>
														<td>
															<span className={`status status-${GetColorByStatus(item.status)}`}>
																<span className={isShowStatusDotAnimated(item.status) ? "status-dot status-dot-animated":""}></span>
																{item.status}
															</span>
														</td>
														<td>{item.buildId}</td>
														<td>
															<div>{item.tag}</div>
															<div className="text-secondary">{item.hashId}</div>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>
}


const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceSettingsPanelContainer)