import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const START_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 4v16l13 -8z" /></svg>
const RESTART_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
const STOP_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>





const PACKAGE_INFORMATION_TABS_LIST = [
	{ label: "Startup Params", code: "startup-params" },
	{ label: "Metadata", code: "metadata" }
]


const SERVICE_TABS_LIST = [
	{ label: "Instances", code: "instances" },
	{ label: "Image Build History", code: "image-build-history" }
]

const INITIAL_PROVISIONED_SERVICE = {
	serviceName: "",
	repositoryNamespace: "",
	packageName: "",
	packageType: "",
	containerName: ""
}

const ServiceSettingsPanelContainer = ({
	HTTPServerManager,
	serviceId
}) => {

	const [packageInfoTabCodeSelected, setPackageInfoTabCodeSelected] = useState("startup-params")
	const [serviceInfoTabCodeSelected, setServiceInfoTabCodeSelected] = useState("instances")


	const [provisionedService, setProvisionedService] = useState(INITIAL_PROVISIONED_SERVICE)
	const [imageBuildHistory, setImageBuildHistory] = useState([])
	const [instances, setInstance] = useState([])


	const {
		serviceName,
		repositoryNamespace,
		packageName,
		packageType,
		containerName
	} = provisionedService


	const IPAddress: string = ""
	const Status: string = ""

	useEffect(() => {

		fetchServiceData()
		fetchImageBuildHistory()
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

	const fetchImageBuildHistory = async () => {
		setImageBuildHistory([])
		const api = getMyServicesManagerAPI()
		const response = await api.ListImageBuildHistory({ serviceId })	
		setImageBuildHistory(response.data)
	}

	const fetchInstances = async () => {
		setInstance([])
		const api = getMyServicesManagerAPI()
		const response = await api.GetInstances({ serviceId })
		setInstance(response.data)
	}

	return <>
		<div className="container-xl">
			<div className="row g-2 align-items-center">
				<div className="col">
					<div className="page-pretitle">Service Settings</div>
					<h2 className="page-title">{serviceName}</h2>
				</div>
			</div>

			<div className="py-4">
				<div className="row g-3 align-items-center">
					<div className="col-auto">
						<span className="status-indicator status-green status-indicator-animated">
							<span className="status-indicator-circle"></span>
							<span className="status-indicator-circle"></span>
							<span className="status-indicator-circle"></span>
						</span>
					</div>
					<div className="col">
						<h2 className="page-title">{repositoryNamespace}/{packageName}/{packageType}</h2>
						<div className="text-secondary">
							<ul className="list-inline list-inline-dots mb-0">
								<li className="list-inline-item"><span className="text-green">{Status.toUpperCase()}</span></li>
								<li className="list-inline-item">{containerName}</li>
							</ul>
						</div>
					</div>
					<div className="col-md-auto ms-auto d-print-none">
						<div className="btn-list">
							{
								Status === "exited"
								&& <button className="btn btn-primary" onClick={() => { }}>
									{START_ICON}start
								</button>
							}
							{
								Status === "running"
								&& <>
									<button className="btn btn-orange">
										{RESTART_ICON}restart
									</button>
									<button className="btn btn-danger" onClick={() => { }}>
										{STOP_ICON}stop
									</button>
								</>
							}
						</div>
					</div>
				</div>
				<div className="row row-cards mt-2">
					<div className="col-12">
						<div className="card">
							<div className="card-header">
									<div className="subheader">Service Information</div>
							</div>
							<div className="card-header bg-blue-lt">
								<ul className="nav nav-tabs card-header-tabs">
									{
										SERVICE_TABS_LIST
											.map((tab) =>
												<li className="nav-item">
													<a className={`nav-link cursor-pointer ${serviceInfoTabCodeSelected === tab.code ? "active" : ""}`} onClick={() => setServiceInfoTabCodeSelected(tab.code)}>{tab.label}</a>
												</li>
											)
									}
								</ul>
							</div>
							<div className="card-body">
								{

									serviceInfoTabCodeSelected === "instances"
									&& <div className="card-table table-responsive">
											<table className="table">
												<thead>
													<tr>
														<th>ID</th>
														<th>Created At</th>
														<th>Container Name</th>
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
																<td>{item.containerName}</td>
															</tr>
														))
													)}
												</tbody>
											</table>
										</div>
								}

								{
									serviceInfoTabCodeSelected === "image-build-history"
									&& <div className="card-table table-responsive">
										<table className="table">
											<thead>
												<tr>
													<th>ID</th>
													<th>Created At</th>
													<th>Tag</th>
												</tr>
											</thead>
											<tbody>
												{imageBuildHistory.length === 0 ? (
													<tr>
														<td colSpan={3} className="text-center">No build history found.</td>
													</tr>
												) : (
													imageBuildHistory.map((item: any) => (
														<tr key={item.id}>
															<td>{item.id}</td>
															<td>{new Date(item.createdAt).toLocaleString()}</td>
															<td>{item.tag}</td>
														</tr>
													))
												)}
											</tbody>
										</table>
									</div>
								}
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="card">
							<div className="card-header">
									<div className="subheader">Package Information</div>
							</div>
							<div className="card-header bg-blue-lt">
								<ul className="nav nav-tabs card-header-tabs">
									{
										PACKAGE_INFORMATION_TABS_LIST
											.map((tab) =>
												<li className="nav-item">
													<a className={`nav-link cursor-pointer ${packageInfoTabCodeSelected === tab.code ? "active" : ""}`} onClick={() => setPackageInfoTabCodeSelected(tab.code)}>{tab.label}</a>
												</li>
											)
									}
								</ul>
							</div>
							<div className="card-body">

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