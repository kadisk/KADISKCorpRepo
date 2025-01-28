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


const SettingsRepositoriesPage = () => {

	const columnsDefinition = {
		"Executable": "executable",
		"App Type": "appType",
		"Package Namespace": "packageNamespace",
		"Supervisor Socket File Name": "supervisorSocketFileName"
	}

	return <DefaultPageWithTitle title="Repository Settings">
				<div className="container-xl">
					<div className="row row-cards">
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
									<Table list={INSTALLED_APPLICATIONS} columnsDefinition={columnsDefinition}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DefaultPageWithTitle>
		}

export default SettingsRepositoriesPage
