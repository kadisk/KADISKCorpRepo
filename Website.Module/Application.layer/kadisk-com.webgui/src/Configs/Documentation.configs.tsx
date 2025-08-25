import * as React from "react"

import IntroducaoArticle from "../PageComponents/Introducao.article"
import PrimeirosPassosArticle from "../PageComponents/PrimeirosPassos.article"
import ArquiteturaEcosistemaArticle from "../PageComponents/ArquiteturaEcosistema.article"
import RepositoriosArticle from "../PageComponents/ArquiteturaEcosistema/Repositorios.article"
import PacotesEMetadadosArticle from "../PageComponents/ArquiteturaEcosistema/PacotesEMetadados.article"

const pkgIcon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-package"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>
const layerIcon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-layers-subtract"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /><path d="M16 16v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h2" /></svg>
const moduleIcon = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-packages"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M2 13.5v5.5l5 3" /><path d="M7 16.545l5 -3.03" /><path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M12 19l5 3" /><path d="M17 16.5l5 -3" /><path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" /><path d="M7 5.03v5.455" /><path d="M12 8l5 -3" /></svg>

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
	"Referências": {
		children:{

			"Repositórios Oficiais":{
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

						}
					}
				}
			},
			
		}
	}
}

export default DocumentationConfigs