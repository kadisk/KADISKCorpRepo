import * as React from "react"
import {useEffect, useState}  from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final-write.svg"

import IntroducaoArticle from "../PageComponents/Introducao.article"
import PrimeirosPassosArticle from "../PageComponents/PrimeirosPassos.article"


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

	},
	"Pacotes":{
		children:{
			"lib": {},
			"service": {},
			"webservice": {},
			"webgui": {},
			"webapp": {}
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

	const handleSelected = ({title, article}) => {
		if(article){
			setArticleTitleCurrent(title)
			setArticleComponent(article)
		}
	}

	const resetSelection = () => {
		setArticleComponent(undefined)
		setArticleTitleCurrent(undefined)
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
									.map((title) => {
										const { article, children } = Summary[title]
										if(children){
											return <li className={`nav-item ${articleTitleCurrent === title && "active"}`} onClick={() => handleSelected({title, article})}>
														<a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button">
															<span className="nav-link-title">{title}</span>
														</a>
														<div className="dropdown-menu show">
															<div className="dropdown-menu-columns">
																<div className="dropdown-menu-column">
																	{
																		Object.keys(children)
																		.map((title) => {
																			debugger
																			const { article } = children[title]
																			return <a className={`dropdown-item ${articleTitleCurrent === title && "active"}`} onClick={() => handleSelected({title, article})}>{title}</a>
																		})
																	}
																</div>
															</div>
														</div>
													</li>
										} else {
											return <li className={`nav-item ${articleTitleCurrent === title && "active"}`} onClick={() => handleSelected({title, article})}>
														<a className="nav-link">
															<span className="nav-link-title">{title}</span>
														</a>
													</li>

										}
									})
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