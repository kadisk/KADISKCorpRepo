import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const INITIAL_PROVISIONED_SERVICE = {
	serviceName: "",
	repositoryNamespace: "",
	packageName: "",
	packageType: ""
}

const ServiceSettingsPanelContainer = ({
	HTTPServerManager,
	serviceId
}) => {

	const [provisionedService, setProvisionedService] = useState(INITIAL_PROVISIONED_SERVICE)	
	const [instances, setInstance] = useState([])

	const {
		serviceName,
		repositoryNamespace,
		packageName,
		packageType
	} = provisionedService

	useEffect(() => {
		fetchServiceData()
		fetchInstances()
	}, [])

	const getMyServicesManagerAPI = () =>
		GetAPI({
			apiName: "MyServicesManager",
			serverManagerInformation: HTTPServerManager
		})


	const fetchServiceData = async () => {
		const api = getMyServicesManagerAPI()
		const response = await api.GetServiceData({ serviceId })

		setProvisionedService(response.data)
	}

	const fetchInstances = async () => {
		setInstance([])
		const api = getMyServicesManagerAPI()
		const response = await api.GetInstances({ serviceId })
		setInstance(response.data)
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
								<li className="list-inline-item"><span className="text-green">{"LOADING".toUpperCase()}</span></li>
								<li className="list-inline-item">{repositoryNamespace}/{packageName}/{packageType}</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="row row-cards mt-2">
					<div className="col-12">
						<div className="card">
							<div className="card-header">
								<div className="subheader">Instances</div>
							</div>
							<div className="card-body p-0">
								<div className="card-table table-responsive">
									<table className="table">
										<thead>
											<tr>
												<th>ID</th>
												<th>Created At</th>
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
														<td>{item.id}</td>
														<td>{new Date(item.createdAt).toLocaleString()}</td>
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
			</div>
		</div>
	</>
}


const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceSettingsPanelContainer)