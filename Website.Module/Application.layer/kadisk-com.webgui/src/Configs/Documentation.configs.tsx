import * as React from "react"

import IntroducaoArticle            from "../PageComponents/Introducao.article"
import PrimeirosPassosArticle       from "../PageComponents/PrimeirosPassos.article"
import ArquiteturaEcosistemaArticle from "../PageComponents/ArquiteturaEcosistema.article"
import RepositoriosArticle          from "../PageComponents/ArquiteturaEcosistema/Repositorios.article"
import PacotesEMetadadosArticle     from "../PageComponents/ArquiteturaEcosistema/PacotesEMetadados.article"

import PacoteLibArticle        from "../PageComponents/Referencias/Pacotes/PacoteLib.article"
import PacoteServiceArticle    from "../PageComponents/Referencias/Pacotes/PacoteService.article"
import PacoteWebserviceArticle from "../PageComponents/Referencias/Pacotes/PacoteWebservice.article"
import PacoteWebguiArticle     from "../PageComponents/Referencias/Pacotes/PacoteWebgui.article"
import PacoteCLIArticle        from "../PageComponents/Referencias/Pacotes/PacoteCLI.article"
import PacoteWebappArticle     from "../PageComponents/Referencias/Pacotes/PacoteWebapp.article"
import PacoteAppArticle        from "../PageComponents/Referencias/Pacotes/PacoteApp.article"

import MetadadosArticle                   from "../PageComponents/Referencias/Metadados.article"
import PackageMetadadoArticle             from "../PageComponents/Referencias/Metadados/PackageMetadado.article"
import BootMetadadoArticle                from "../PageComponents/Referencias/Metadados/BootMetadado.article"
import EndpointMetadadoArticle            from "../PageComponents/Referencias/Metadados/EndpointGroupMetadado.article"
import CommandGroupMetadadoArticle        from "../PageComponents/Referencias/Metadados/CommandGroupMetadado.article"
import ServicesMetadadoArticle            from "../PageComponents/Referencias/Metadados/ServicesMetadado.article"
import StartupParamsMetadadoArticle       from "../PageComponents/Referencias/Metadados/StartupParamsMetadado.article"
import StartupParamsSchemaMetadadoArticle from "../PageComponents/Referencias/Metadados/StartupParamsSchemaMetadado.article"

import RepositoryManagerArticle from "../PageComponents/Referencias/Aplicativos/myrepo.article"
import MaintenanceToolkitArticle from "../PageComponents/Referencias/Aplicativos/mytoolkit.article"
import ExecutionSupervisorArticle from "../PageComponents/Referencias/Aplicativos/supervisor.article"

const pkgIcon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-package"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>
const layerIcon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-layers-subtract"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /><path d="M16 16v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h2" /></svg>
const moduleIcon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-packages"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M2 13.5v5.5l5 3" /><path d="M7 16.545l5 -3.03" /><path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M12 19l5 3" /><path d="M17 16.5l5 -3" /><path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" /><path d="M7 5.03v5.455" /><path d="M12 8l5 -3" /></svg>
const groupIcon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-archive"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" /><path d="M10 12l4 0" /></svg>
const terminal2Icon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-terminal-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9l3 3l-3 3" /><path d="M13 15l3 0" /><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>
const fileCode2Icon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-file-code-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12h-1v5h1" /><path d="M14 12h1v5h-1" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>

const DocumentationConfigs = {
	"Introdução":{
		article: IntroducaoArticle
	},
	"Primeiros passos":{
		children:{
			"Configurando um ecosistema localmente":{
				article: PrimeirosPassosArticle
			}
		}
	},
	"Arquitetura Ecosistema":{
		article: ArquiteturaEcosistemaArticle,
		children: {
			"Repositórios" : {
				article: RepositoriosArticle
			},
			"Pacotes e Metadados" : {
				article: PacotesEMetadadosArticle
			},
			"Ecosistema" : {},
		}

	},
	"Referência Aplicativos": {
		isShow: false,
		children: {
			"repo" :{
				icon: terminal2Icon,
				article: RepositoryManagerArticle,
				children: {
					"Fontes disponíveis": {},
					"Repositórios instalados": {},
					"Instalação e atualização": {},
					"Informações detalhadas": {},
					"Gerenciamento de fontes": {}
				}
			},
			"mytoolkit" :{
				icon: terminal2Icon,
				article: MaintenanceToolkitArticle,
				children: {
					"Listagem de perfis": {},
					"Instalação do ecossistema": {},
					"Atualização do ecossistema": {},
					"Visualização de informações": {}
				}
			},
			"supervisor" :{
				icon: terminal2Icon,
				article: ExecutionSupervisorArticle,
				children:{
					"Listagem de sockets": {},
					"Status de execução": {},
					"Tarefas em execução": {},
					"Visualização de logs": {},
					"Controle de instâncias": {},
					"Informações detalhadas de tarefas": {}
				}
			}
		}
	},
	"Referências Metadados":{
		isShow: true,
		article: MetadadosArticle,
		children: {
			"package.json":{
				icon: fileCode2Icon,
				article: PackageMetadadoArticle
			},
			"services.json":{
				icon: fileCode2Icon,
				article: ServicesMetadadoArticle
			},
			"endpoint-group.json":{
				icon: fileCode2Icon,
				article: EndpointMetadadoArticle
			},
			"command-group.json":{
				icon: fileCode2Icon,
				article: CommandGroupMetadadoArticle
			},
			"boot.json":{
				icon: fileCode2Icon,
				article: BootMetadadoArticle
			},
			"startup-params.json":{
				icon: fileCode2Icon,
				article: StartupParamsMetadadoArticle,
				children: {
					"schema":{
						icon: fileCode2Icon,
						article: StartupParamsSchemaMetadadoArticle
					}
				}
			}
		}
	},
	"Referência Pacotes": {
		isShow: true,
		children: {
			"lib": {
				article: PacoteLibArticle
			},
			"service": {
				article: PacoteServiceArticle
			},
			"webservice": {
				article: PacoteWebserviceArticle
			},
			"webgui": {
				article: PacoteWebguiArticle
			},
			"cli": {
				article: PacoteCLIArticle
			},
			"webapp": {
				article: PacoteWebappArticle
			},
			"app":{
				article: PacoteAppArticle
			}
		}
	},
	"Referência Repositórios": {
		children:{
			"Essential": {
				children:{
					"Commons.Module": {
						icon: moduleIcon,
						children: {
							"Libraries.layer":{
								icon:layerIcon,
								children:{
									"copy-directory.lib":{
										icon: pkgIcon
									},
									"download-file.lib":{
										icon: pkgIcon
									},
									"ecosystem-install-utilities.lib":{
										icon: pkgIcon
									},
									"extract-tar-gz.lib":{
										icon: pkgIcon
									},
									"json-file-utilities.lib":{
										icon: pkgIcon
									},
									"load-metatada-dir.lib":{
										icon: pkgIcon
									},
									"print-data-log.lib":{
										icon: pkgIcon
									},
									"repository-config-handler.lib":{
										icon: pkgIcon
									},
									"script-file-utilities.lib":{
										icon: pkgIcon
									},
									"smart-require.lib":{
										icon: pkgIcon
									},
									"supervisor.lib":{
										icon: pkgIcon
									},
								}
							},
							"PlatformLibraries.layer": {
								icon:layerIcon,
								children:{
									"environment-handler.lib":{
										icon: pkgIcon
									},
									"repository-utilities.lib":{
										icon: pkgIcon
									}
								}
							},
							"Utilities.layer": {
								icon:layerIcon,
								children: {
									"compute-object-hash.lib": {
										icon: pkgIcon
									},
									"task-table-render.lib": {
										icon: pkgIcon
									},
									"utilities.lib": {
										icon: pkgIcon
									}
								}
							},
						}
					},
					"Main.Module": {
						icon: moduleIcon,
						children: {
							"Application.layer":{
								icon:layerIcon,
								children: {
									"instance-supervisor.cli": {
										icon: pkgIcon
									},
									"maintenance-toolkit.cli": {
										icon: pkgIcon
									},
									"package-wizard.cli": {
										icon: pkgIcon
									},
									"repository-manager.cli": {
										icon: pkgIcon
									}
								}
							}
						}
					},
					"Runtime.Module": {
						icon: moduleIcon,
						children: {
							"EssentialTaskLoaders.layer": {
								icon:layerIcon,
								children: {
									"application-instance.lib": {
										icon: pkgIcon
									},
									"command-application.lib": {
										icon: pkgIcon
									},
									"endpoint-instance.lib": {
										icon: pkgIcon
									},
									"install-nodejs-package-dependencies.lib": {
										icon: pkgIcon
									},
									"nodejs-package.lib": {
										icon: pkgIcon
									},
									"service-instance.lib": {
										icon: pkgIcon
									},
								}
							},
							"Executor.layer": {
								icon:layerIcon,
								children: {
									"task-executor.lib": {
										icon: pkgIcon
									}
								}
							},
							"MetadataHelpers.layer": {
								icon:layerIcon,
								children: {
									"dependency-graph-builder.lib": {
										icon: pkgIcon
									},
									"execution-params-generator.lib": {
										icon: pkgIcon
									},
									"metadata-hierarchy-handler.lib": {
										icon: pkgIcon
									},
									"resolve-package-name.lib": {
										icon: pkgIcon
									}
								}
							},
						}
					},
				}
			},
			"Ecosystem Core": {
				children:{
					"Main.Module":{
						icon: moduleIcon,
						children: {
							"Application.layer":{
								icon:layerIcon,
								children:{
									"ecosystem-daemon-launcher.cli":{
										icon: pkgIcon
									},
									"ecosystem-instance-manager.app":{
										icon: pkgIcon
									},
									"EcosystemControlPanel.group":{
										icon: groupIcon,
										children: {
											"ecosystem-control-panel.service":{
												icon: pkgIcon
											},
											"ecosystem-control-panel.webapp":{
												icon: pkgIcon
											},
											"ecosystem-control-panel.webgui":{
												icon: pkgIcon
											},
											"ecosystem-control-panel.webservice":{
												icon: pkgIcon
											},
										}
									},
									"instance-executor.cli":{
										icon: pkgIcon
									},
									"InstanceExecutorControlPanel.group":{
										icon: groupIcon,
										children: {
											"instance-executor-control-panel.webapp":{
												icon: pkgIcon
											},
											"instance-executor-control-panel.webgui":{
												icon: pkgIcon
											},
											"instance-executor-control-panel.webservice":{
												icon: pkgIcon
											}
										}
									},
									"repository-explorer.cli":{
										icon: pkgIcon
									},
									"ServerManager.group":{
										icon: groupIcon,
										children: {
											"server-manager.webapp":{
												icon: pkgIcon
											},
											"server-manager.webgui":{
												icon: pkgIcon
											}
										}
									},
								}
							},
							"Libraries.layer":{
								icon:layerIcon,
								children:{
									"command-executor.lib":{
										icon: pkgIcon
									},
									"mount-api.lib":{
										icon: pkgIcon
									}
								}
							},
							"Services.layer":{
								icon:layerIcon,
								children:{
									"ecosystem-manager.service":{
										icon: pkgIcon
									},
									"environment-runtime-manager.service":{
										icon: pkgIcon
									},
									"instance-supervisor.service":{
										icon: pkgIcon
									},
									"repository-manager.service":{
										icon: pkgIcon
									},
									"server-manager.service":{
										icon: pkgIcon
									},
									"task-executor-machine.service": {
										icon: pkgIcon
									}
								}
							},
							"Webservices.layer":{
								icon:layerIcon,
								children:{
									"server-manager.webservice":{
										icon: pkgIcon
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

export default DocumentationConfigs