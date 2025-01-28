import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

const ECOSYSTEM_DEFAULTS = {
	"REPOS_CONF_FILENAME_SOURCE_DATA": "sources.json",
	"REPOS_CONF_FILENAME_REPOS_DATA": "repositories.json",
	"REPOS_CONF_EXT_MODULE_DIR": "Module",
	"REPOS_CONF_EXT_LAYER_DIR": "layer",
	"REPOS_CONF_EXT_GROUP_DIR": "group",
	"REPOS_CONF_EXTLIST_PKG_TYPE": "app|cli|webapp|webgui|webservice|service|lib",
	"REPOS_CONF_DIRNAME_METADATA": "metadata",
	"PKG_CONF_DIRNAME_METADATA": "metadata",
	"ECOSYSTEMDATA_CONF_DIRNAME_DOWNLOADED_REPOSITORIES": "repos",
	"ECOSYSTEMDATA_CONF_DIRNAME_EXECUTION_DATA_DIR": "environments",
	"ECOSYSTEMDATA_CONF_DIRNAME_UNIX_SOCKET_DIR": "sockets",
	"ECOSYSTEMDATA_CONF_DIRNAME_SUPERVISOR_UNIX_SOCKET_DIR": "supervisor-sockets",
	"ECOSYSTEMDATA_CONF_DIRNAME_ESSENTIAL_BINARY_DIR": "binaries",
	"ECOSYSTEMDATA_CONF_DIRNAME_GLOBAL_EXECUTABLES_DIR": "executables",
	"ECOSYSTEMDATA_CONF_DIRNAME_CONFIGURATIONS_DIR": "config-files",
	"ECOSYSTEMDATA_CONF_DIRNAME_NPM_DEPENDENCIES": "npm-dependencies",
	"ECOSYSTEMDATA_CONF_FILENAME_PKG_GRAPH_DATA": "metadata-hierarchy.json",
	"ECOSYSTEMDATA_CONF_FILENAME_EXECUTION_PLAN_DATA": "execution-params.json",
	"EXECUTIONDATA_CONF_DIRNAME_DEPENDENCIES": ".dependencies"
}

const DefaultParametersPage = () => {
	return <DefaultPageWithTitle title="Default Parameters" preTitle="Ecosystem Settings">
		<div className="container-xl">
			<div className="row row-cards">
				<div className="col-12">
					<div className="card">
						<div className="table-responsive">
							<table className="table table-vcenter table-mobile-md card-table">
								<tbody>
									{
										Object.keys(ECOSYSTEM_DEFAULTS)
											.map((parameterName) => <tr>
												<td>
													<div className="text-secondary">{parameterName}</div>
													<div><h4>{ECOSYSTEM_DEFAULTS[parameterName]}</h4></div>
												</td>
												<td className="text-end">
													<button className="btn">
														Edit
													</button>
												</td>
											</tr>)
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</DefaultPageWithTitle>
}

export default DefaultParametersPage
