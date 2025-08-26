import * as React from "react"
import {useEffect, useState}  from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final-write.svg"

import DocumentationConfigs from "../Configs/Documentation.configs"


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
		article,
		icon
	}) => {
		return <a className={`ms-3 dropdown-item ${articleTitleCurrent === title && "active"}`} onClick={(e) => handleSelected(e, {title, article})}>{icon}{title}</a>
	}

	const renderDropEnd = ({
		title, 
		article,
		icon,
		children,
	}) => {
		return <div className="ms-3">
			<a className="dropdown-item dropdown-toggle" onClick={(e) => handleSelected(e, {title, article})} data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
			{icon}{title}
			</a>
			<div className="dropdown-menu">
				{
					Object.keys(children)
					.map((title) => {
						const { article, children: _children, icon } = children[title]
						if(_children){
							return renderDropEnd({ title, article, children: _children, icon })
						} else {
							return renderDropdownItem({ title, article, icon })
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
											const { article, children: _children, icon } = children[title]
											if(_children){
												return renderDropEnd({ title, article, children: _children, icon})
											} else {
												return renderDropdownItem({ title, article, icon })
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
				<aside className="navbar navbar-vertical navbar-expand-lg w-auto" data-bs-theme="dark">
					<div className="container-fluid">
						<div className="navbar-brand px-3">
						<a href="#meta-platform"><img className="pt-3" style={{maxHeight:"56px"}} src={logoMyPlatform}/></a>
						</div>
						<div className="collapse navbar-collapse mb-5">
							<ul className="navbar-nav">
								{
									Object
									.keys(DocumentationConfigs)
									.map((title) => renderMenuItem(title, DocumentationConfigs[title]))
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
									© 2025 Kadisk Engenharia de Software LTDA.  
									Distribuído sob a licença BSD 3-Clause.  
									<a href="https://opensource.org/licenses/BSD-3-Clause" target="_blank" rel="noopener noreferrer">
									Saiba mais
									</a>
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