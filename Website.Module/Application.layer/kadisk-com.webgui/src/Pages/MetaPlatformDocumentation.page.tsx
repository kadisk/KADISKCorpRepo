import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import qs from "query-string"
import { 
	useNavigate,
	useLocation
  } from "react-router-dom"


import QueryParamsActionsCreator from "../Actions/QueryParams.actionsCreator"


//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final-write.svg"

import DocumentationConfigs from "../Configs/Documentation.configs"

const GetArticlesByConfigs = (configs: any) => {

	const GetList = (children, stackIndex) => {
		const artileList = Object
		.keys(children)
		.reduce((acc, title, index) => {
			
			const { article, children: _children } = children[title]

			return [
				...acc,
				...article ? [{ uri: [...stackIndex, index].join("."), article}] : [],
				..._children?GetList(_children, [...stackIndex, index]):[]
			]

		}, [])

		return artileList
	}

	return GetList(configs, [])
		.reduce((acc, {uri, article})=> {
			return { ...acc, [uri]: article }
		}, {})
}

const GetUriByStack = (stackIndex) => {
	return stackIndex.join(".")
}

const MetaPlatformDocumentationPage = ({
    AddQueryParam,
	QueryParams,
	SetQueryParams
}) => {

	const [ articleUriCurrent, setArticleUriCurrent ] = useState<any>()
	const [ articleContent, setArticleContent ] = useState<React.ReactNode | null>(null)

	const [ articles, setArticles ] = useState<any>()

	const location = useLocation()
  	const navigate = useNavigate()
	const queryParams = qs.parse(location.search.substr(1))

	useEffect(() => {
		if(!articles){
			setArticles(GetArticlesByConfigs(DocumentationConfigs))
		}

		if(Object.keys(queryParams).length > 0){
			SetQueryParams(queryParams)
			if(queryParams.articleUri)
				setArticleUriCurrent(queryParams.articleUri)
		}

	}, [])

	useEffect(() => {
		const search = qs.stringify(QueryParams)
		navigate({search: `?${search}`})
	}, [QueryParams])

	useEffect(() => {
		if(articleUriCurrent){
			const article = articles[articleUriCurrent]
			if(article){
				setArticleContent(article())
			}
		} else {
			setArticleContent(undefined)
		}

	}, [articleUriCurrent])

	const handleSelected = (e, stackIndex) => {
		e.stopPropagation()

		const uri = GetUriByStack(stackIndex)
		AddQueryParam("articleUri", uri)
		setArticleUriCurrent(uri)
	}

	const renderSimpleItem = (title, stackIndex) =>{
		return <li className={`nav-item ${articleUriCurrent === GetUriByStack(stackIndex) && "active"}`} onClick={(e) => handleSelected(e, stackIndex)}>
					<a className="nav-link">
						<span className="nav-link-title">{title}</span>
					</a>
				</li>
	}

	const renderDropdownItem = ({
		title,
		icon,
		stackIndex
	}) => {
		return <a className={`ms-3 dropdown-item ${articleUriCurrent === GetUriByStack(stackIndex) && "active"}`} onClick={(e) => handleSelected(e, stackIndex)}>{icon}{title}</a>
	}

	const renderDropEnd = ({
		title, 
		icon,
		children,
		stackIndex
	}) => {

		return <div className="ms-3">
			<a className="dropdown-item dropdown-toggle" onClick={(e) => handleSelected(e, stackIndex)} data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
			{icon}{title}
			</a>
			<div className="dropdown-menu">
				{
					Object.keys(children)
					.map((title, index) => {
						const { children: _children, icon } = children[title]
						if(_children){
							return renderDropEnd({ title, children: _children, icon, stackIndex: [...stackIndex, index ] })
						} else {
							return renderDropdownItem({ title, icon, stackIndex: [...stackIndex, index ] })
						}
					})
				}
			</div>
		</div> 
	}

	const renderDropdownMenu = (children, stackIndex) => {
		return <div className="dropdown-menu show">
							<div className="dropdown-menu-columns">
								<div className="dropdown-menu-column">
									{
										Object.keys(children)
										.map((title, index) => {
											const { children: _children, icon } = children[title]
											if(_children){
												return renderDropEnd({ title, children: _children, icon, stackIndex: [...stackIndex, index]})
											} else {
												return renderDropdownItem({ title, icon, stackIndex: [...stackIndex, index] })
											}
										})
									}
								</div>
							</div>
						</div>
	}

	const renderNavItem = (title, children, stackIndex) => {
		return <li className={`nav-item ${articleUriCurrent === GetUriByStack(stackIndex) && "active"}`} onClick={(e) => handleSelected(e, stackIndex)}>
						<a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button">
							<span className="nav-link-title">{title}</span>
						</a>
						{renderDropdownMenu(children, stackIndex)}
					</li>
	}

	const renderMenuItem = (title, item, stackIndex) => {
		const { children } = item
		if(children){
			return renderNavItem(title, children, stackIndex)
		} else 
			return renderSimpleItem(title, stackIndex)
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
									.map((title, index) => renderMenuItem(title, DocumentationConfigs[title], [index]))
								}
							</ul>
						</div>
					</div>
				</aside>
				<div className="page-wrapper">
					<div className="page-body">
						{articleContent}
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

const mapDispatchToProps = (dispatch:any) => bindActionCreators({
	AddQueryParam    : QueryParamsActionsCreator.AddQueryParam,
	SetQueryParams   : QueryParamsActionsCreator.SetQueryParams,
	RemoveQueryParam : QueryParamsActionsCreator.RemoveQueryParam
}, dispatch)

const mapStateToProps = ({HTTPServerManager, QueryParams}:any) => ({
	HTTPServerManager,
	QueryParams
})

export default connect(mapStateToProps, mapDispatchToProps)(MetaPlatformDocumentationPage)