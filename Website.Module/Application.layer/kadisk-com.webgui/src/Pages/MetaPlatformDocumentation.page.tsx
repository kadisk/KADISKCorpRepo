import * as React from "react"
import {useEffect, useState}  from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final-write.svg"

import IntroducaoArticle from "../PageComponents/Introducao.article"
import PrimeirosPassosArticle from "../PageComponents/PrimeirosPassos.article"
import ArquiteturaEcosistemaArticle from "../PageComponents/ArquiteturaEcosistema.article"
import RepositoriosArticle from "../PageComponents/ArquiteturaEcosistema/Repositorios.article"
import PacotesEMetadadosArticle from "../PageComponents/ArquiteturaEcosistema/PacotesEMetadados.article"

const Summary = {
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
							"Commons": {
								children: {
										"copy-directory.lib":{},
										"download-file":{},
										"ecosystem-install-utilities":{},
										"extract-tar-gz":{},
										"json-file-utilities":{}
									}
								},
								"Runtime": {},
								"Main": {},
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

type HomepageParamsType = {
	api?: string
	summary?: string
}

type HomepageContainerProps = {
	queryParams: HomepageParamsType
	onChangeQueryParams: any
	HTTPServerManager: any
}

const MetaPlatformDocumentationPage = ({
	queryParams,
	onChangeQueryParams,
	HTTPServerManager
}: HomepageContainerProps) => {

	const [ articleTitleCurrent, setArticleTitleCurrent ] = useState()
	const [ ArticleComponent, setArticleComponent ] = useState<any>()

	const handleSelected = (e, {title, article}) => {
		e.stopPropagation()
		if(article){
			setArticleTitleCurrent(title)
			setArticleComponent(article)
		}
	}

	const resetSelection = () => {
		setArticleComponent(undefined)
		setArticleTitleCurrent(undefined)
	}

	const renderSimpleItem = (title, article) =>{
		return <li className={`nav-item ${articleTitleCurrent === title && "active"}`} onClick={(e) => handleSelected(e, {title, article})}>
					<a className="nav-link">
						<span className="nav-link-title">{title}</span>
					</a>
				</li>
	}

	const renderDropdownItem = ({
		title,
		article
	}) => {
		return <a className={`dropdown-item ${articleTitleCurrent === title && "active"}`} onClick={(e) => handleSelected(e, {title, article})}>{title}</a>
	}

	const renderDropEnd = ({
		title, 
		article,
		children
	}) => {
		return <div className="dropend">
			<a className="dropdown-item dropdown-toggle" onClick={(e) => handleSelected(e, {title, article})} data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
			{title}
			</a>
			<div className="dropdown-menu">
				{
					Object.keys(children)
					.map((title) => {
						const { article, children: _children } = children[title]
						if(_children){
							return renderDropEnd({ title, article, children: _children })
						} else {
							return renderDropdownItem({ title, article })
						}
					})
				}
			</div>
		</div> 
	}

	const renderDropdownMenu = (children) => {
		return <div className="dropdown-menu show">
							<div className="dropdown-menu-columns">
								<div className="dropdown-menu-column">
									{
										Object.keys(children)
										.map((title) => {
											const { article, children: _children } = children[title]
											if(_children){
												return renderDropEnd({ title, article, children: _children })
											} else {
												return renderDropdownItem({ title, article })
											}
										})
									}
								</div>
							</div>
						</div>
	}

	const renderNavItem = (title, article, children) => {
		return <li className={`nav-item ${articleTitleCurrent === title && "active"}`} onClick={(e) => handleSelected(e, {title, article})}>
						<a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button">
							<span className="nav-link-title">{title}</span>
						</a>
						{renderDropdownMenu(children)}
					</li>

	}

	const renderMenuItem = (title, item) => {
		const { article, children } = item
		if(children){
			return renderNavItem(title, article, children)
		} else 
			return renderSimpleItem(title, article)
	}

	return <div className="page">
				<aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
					<div className="container-fluid">
						<div className="navbar-brand px-3">
							<a href="#meta-platform"><img src={logoMyPlatform}/></a>
						</div>
						<div className="collapse navbar-collapse">
							<ul className="navbar-nav">
								{
									Object
									.keys(Summary)
									.map((title) => renderMenuItem(title, Summary[title]))
								}
							</ul>
						</div>
					</div>
				</aside>
				<div className="page-wrapper">
					<div className="page-body">
						{
							ArticleComponent
							&& <ArticleComponent />
						}
					</div>
					<footer className="footer footer-transparent d-print-none">
						<div className="container-xl">
							<div className="row text-center align-items-center flex-row-reverse">
								<div className="col-lg-auto ms-lg-auto">
									© 2025 Kadisk Engenharia de Software LTDA. Todos os direitos reservados.
								</div>
							</div>
						</div>
					</footer>
				</div>
			</div>
}

const mapDispatchToProps = (dispatch: any) =>
	bindActionCreators({

	}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => ({
	HTTPServerManager
})

export default connect(mapStateToProps, mapDispatchToProps)(MetaPlatformDocumentationPage)