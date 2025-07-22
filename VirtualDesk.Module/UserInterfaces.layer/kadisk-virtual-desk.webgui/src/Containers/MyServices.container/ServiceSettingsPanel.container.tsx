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
        case "STARTING":
            return "cyan"
        case "FAILURE":
            return "red"
        case "TERMINATED":
        case "STOPPED":
			return "gray"
		case "WAITING":
		case "LOADING":
            return "yellow"
        default:
            return "orange"
    }
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

const ServiceSettingsPanelContainer = ({
	HTTPServerManager,
	serviceId
}) => {

	const [ serviceData, setServiceData ] = useState(INITIAL_PROVISIONED_SERVICE)	
	const [ instances, setInstance ] = useState([])
	const [ containers, setContainers ] = useState([])
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

	useEffect(() => {
		if(serviceData.serviceId){
			if(!instanceListSocketHandler.isConneted())
				instanceListSocketHandler.connect({ serviceId: serviceData.serviceId })
			if(!containerListSocketHandler.isConneted())
				containerListSocketHandler.connect({ serviceId: serviceData.serviceId })
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

	return <>
		<div className="container-xl">
			<div>
				<div className="row g-3 align-items-center">
					<div className="col">
						<div className="page-pretitle">Service Settings</div>
						<h2 className="page-title">{serviceName}</h2>
						<div className="text-secondary">
							<ul className="list-inline list-inline-dots mb-0">
								<li className="list-inline-item"><span className={`text-${GetColorByStatus(serviceStatus.toUpperCase())}`}>{serviceStatus.toUpperCase()}</span></li>
								<li className="list-inline-item">{repositoryNamespace}/{packageName}/{packageType}</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="row row-cards mt-2">
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
													<td colSpan={3} className="text-center">No instances found.</td>
												</tr>
											) : (
												instances.map((item: any) => (
													<tr key={item.id}>
														<td>
															<span className={`status status-${GetColorByStatus(item.status)}`}>
																<span className="status-dot status-dot-animated"></span>
																{item.status}
															</span>
														</td>
														<td>{item.instanceId}</td>
														<td>{item.networkmode}</td>
														<td>{JSON.stringify(item.ports, null, 2)}</td>
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
													<tr key={item.id}>
														<td>
															<span className={`status status-${GetColorByStatus(item.status)}`}>
																<span className="status-dot status-dot-animated"></span>
																{item.status}
															</span>
														</td>
														<td>{item.id}</td>
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
			</div>
		</div>
	</>
}


const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceSettingsPanelContainer)