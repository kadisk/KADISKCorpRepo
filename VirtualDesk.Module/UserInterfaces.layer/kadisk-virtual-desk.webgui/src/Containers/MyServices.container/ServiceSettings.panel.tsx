import * as React from "react"


const START_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
const RESTART_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
const STOP_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>

const ServiceSettingsPanel = ({
	provisionedService
}) =>
	<>
		<div className="row g-3 align-items-center">
			<div className="col-auto">
				<span className="status-indicator status-green status-indicator-animated">
					<span className="status-indicator-circle"></span>
					<span className="status-indicator-circle"></span>
					<span className="status-indicator-circle"></span>
				</span>
			</div>
			<div className="col">
				<h2 className="page-title">{provisionedService.repositoryNamespace}/{provisionedService.packageName}/{provisionedService.packageType}</h2>
				<div className="text-secondary">
					<ul className="list-inline list-inline-dots mb-0">
						<li className="list-inline-item"><span className="text-green">{provisionedService.containerStatus.toUpperCase()}</span></li>
						<li className="list-inline-item">{provisionedService.containerName}</li>
					</ul>
				</div>
			</div>
			<div className="col-md-auto ms-auto d-print-none">
				<div className="btn-list">
					{
						provisionedService.containerStatus === "exited"
						&& <button className="btn btn-primary" onClick={() => {}}>
								{START_ICON}start
							</button>
					}
					{
						provisionedService.containerStatus === "running"
						&& <>
								<button className="btn btn-orange">
									{RESTART_ICON}restart
								</button>
								<button className="btn btn-danger" onClick={() => {}}>
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
						<div className="h3 m-0">{provisionedService.containerIPAddress}</div>
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
	</>


export default ServiceSettingsPanel