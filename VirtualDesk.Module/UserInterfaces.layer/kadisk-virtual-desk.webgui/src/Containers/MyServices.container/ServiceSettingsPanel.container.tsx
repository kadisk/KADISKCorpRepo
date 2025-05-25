import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const START_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 4v16l13 -8z" /></svg>
const RESTART_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
const STOP_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>


const TABS_LIST = [
	{ label: "Image Build History", code: "image-build-history" },
	{ label: "Instances", code: "service-instance" }
]

const ServiceSettingsPanelContainer = ({
	HTTPServerManager,
	serviceId
}) => {

	const [tabCodeSelected, setTabCodeSelected] = useState("image-build-history")
	const [provisionedService, setProvisionedService] = useState({
		executableName: "",
		repositoryNamespace: "",
		packageName: "",
		packageType: "",
		containerName: ""
	})


	const {
		executableName,
		repositoryNamespace,
		packageName,
		packageType,
		containerName
	} = provisionedService


	const IPAddress: string = ""
	const Status: string = ""

	useEffect(() => {

		fetchServiceData()

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


	return <>
		<div className="container-xl">
			<div className="row g-2 align-items-center">
				<div className="col">
					<div className="page-pretitle">Service Settings</div>
					<h2 className="page-title">{executableName}</h2>
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
					<div className="col-md-4">
						<div className="card">
							<div className="card-body">
								<div className="subheader">Container IP Address</div>
								<div className="h3 m-0">{IPAddress}</div>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="card">
							<div className="card-body">
								<div className="subheader">xxxx</div>
								<div className="h3 m-0">xxxx</div>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="card">
							<div className="card-body">
								<div className="subheader">xxxx</div>
								<div className="h3 m-0">xxxx</div>
							</div>
						</div>
					</div>


					<div className="col-12">
						<div className="card">
							<div className="card-header bg-blue-lt">
								<ul className="nav nav-tabs card-header-tabs">
									{
										TABS_LIST
											.map((tab) =>
												<li className="nav-item">
													<a className={`nav-link cursor-pointer ${tabCodeSelected === tab.code ? "active" : ""}`} onClick={() => setTabCodeSelected(tab.code)}>{tab.label}</a>
												</li>
											)
									}
								</ul>
							</div>
							<div className="card-body">
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
										<tbody>
											<tr>
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
		</div>
	</>
}


const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceSettingsPanelContainer)