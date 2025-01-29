import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"
import Table from "../../Components/Table"

const INSTALLED_APPLICATIONS = [
	{
		"appType": "APP",
		"executable": "executor-manager",
		"packageNamespace": "Main.Module/Application.layer/ecosystem-instance-manager.app",
		"supervisorSocketFileName": "instance-manager.sock"
	},
	{
		"appType": "APP",
		"executable": "executor-panel",
		"packageNamespace": "Main.Module/Application.layer/InstanceExecutorControlPanel.group/instance-executor-control-panel.webapp",
		"supervisorSocketFileName": "executor-panel.sock"
	},
	{
		"appType": "CLI",
		"executable": "explorer",
		"packageNamespace": "Main.Module/Application.layer/repository-explorer.cli",
		"supervisorSocketFileName": "explorer.sock"
	},
	{
		"appType": "CLI",
		"executable": "executor",
		"packageNamespace": "Main.Module/Application.layer/instance-executor.cli",
		"supervisorSocketFileName": "executor.sock"
	},
	{
		"appType": "CLI",
		"executable": "mylauncher",
		"packageNamespace": "Main.Module/Application.layer/ecosystem-daemon-launcher.cli",
		"supervisorSocketFileName": "launcher.sock"
	},
	{
		"appType": "APP",
		"executable": "eco-panel",
		"packageNamespace": "Main.Module/Application.layer/EcosystemControlPanel.group/ecosystem-control-panel.webapp",
		"supervisorSocketFileName": "eco-panel.sock"
	}
]


const RepositorySettings = () => {


	const columnsDefinition = {
		"Executable": "executable",
		"App Type": "appType",
		"Package Namespace": "packageNamespace",
		"Supervisor Socket File Name": "supervisorSocketFileName"
	}

	return <div className="row row-cards">
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<div className="col">
						<div className="page-pretitle">Repository Namespace</div>
						<h2 className="page-title">EssentialRepo</h2>
					</div>
				</div>
				<div className="card-body">
					<div>
						<div className="text-secondary">Installation Path</div>
						<div>/home/kadisk/EcosystemData/repos/EssentialRepo</div>
					</div>
				</div>
				<div className="card-body">
					<h4>Source Data</h4>
					<div className="datagrid">
						<div className="datagrid-item">
							<div className="datagrid-title">source type</div>
							<div className="datagrid-content">LOCAL_FS</div>
						</div>
						<div className="datagrid-item">
							<div className="datagrid-title">path</div>
							<div className="datagrid-content">~/Workspaces/meta-platform-repo/repos/ecosystem-core-repository</div>
						</div>
					</div>
				</div>
				<div className="card-body">
					<h4>Installed Applications</h4>
					<Table list={INSTALLED_APPLICATIONS} columnsDefinition={columnsDefinition} />
				</div>
			</div>
		</div>
	</div>
}

const RepositorySettingsPage = () => {


	return <DefaultPageWithTitle title="Repository Settings" preTitle="Ecosystem Settings">
		<div className="container-xl">
			<div className="row row-cards">
				<div className="col-12">
					<div className="card">
						<div className="table-responsive">
							<table className="table table-vcenter table-mobile-md card-table">
								<tbody>
									<tr>
										<td>
											<div className="text-secondary">Repository Namespace</div>
											<div><h3>EssentialRepo</h3></div>
											<div className="card m-2 bg-primary-lt">
												<div className="card-body p-2">
												<h5 className="mb-1">Content source data</h5>
												<div className="datagrid">
													<div className="datagrid-item">
														<div className="datagrid-title">source type</div>
														<div className="datagrid-content">LOCAL_FS</div>
													</div>
													<div className="datagrid-item">
														<div className="datagrid-title">path</div>
														<div className="datagrid-content">~/Workspaces/meta-platform-repo/repos/ecosystem-core-repository</div>
													</div>
												</div>
												</div>
											</div>
										</td>
										<td className="text-end">
											<button className="btn btn-secondary m-2">
												<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-list-details"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 5h8" /><path d="M13 9h5" /><path d="M13 15h8" /><path d="M13 19h5" /><path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /></svg>
												show more details
											</button>
											<button className="btn btn-warning">
												<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
												update repository content 
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</DefaultPageWithTitle>
}

export default RepositorySettingsPage
