import * as React             from "react"
import {useEffect, useState}  from "react"
//@ts-ignore
import { Routes, BrowserRouter, HashRouter, Route }  from "react-router-dom"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import axios                  from "axios"

import HTTPServerManagerActionsCreator from "../Actions/HTTPServerManager.actionsCreator"

import GetAPI from "../Utils/GetAPI"

const FetchHTTPServersRunning = async () => {
    // @ts-ignore
    const {data} = await axios.get(process.env.HTTP_SERVER_MANAGER_ENDPOINT)
    return data
}

const GetToken = () => localStorage.getItem("token")

type AppContainerProps  = {
	routesConfig: any
	mapper: any
	HTTPServerManager : any
	SetHTTPServersRunning : Function
}

type RouteConfigType = {
	path:string,
	page:string
}

const GetRouteObject = (routesConfig:any[], mapper:any) =>  
	routesConfig.map(({path, page}:RouteConfigType) => {
		const Component = mapper[page]
		return {path, element:<Component/>}
	})



const AppContainer = ({
	routesConfig,
	mapper,
	HTTPServerManager, 
	SetHTTPServersRunning
}:AppContainerProps) => {

	const [userData, setUserData] = useState()

	useEffect(()=>{
        FetchHTTPServersRunning()
        .then(webServersRunning => SetHTTPServersRunning(webServersRunning))
    }, [])


	useEffect(()=>{
        if(hasServersRunning()){
			const token = GetToken()
			if(token){
				fetchUserData()
			}
		}
    }, [HTTPServerManager])

	const getUserInformationAPI = () => 
        GetAPI({ 
            apiName:"UserInformation",  
            serverManagerInformation: HTTPServerManager
        })


	const fetchUserData = async () => {
		try {
			const response = await getUserInformationAPI().GetUserData()
			const userData = response.data
			setUserData(userData)

			if (window.location.hash === "" || window.location.hash === "#") {
				window.location.href = "#my-services"
			}

		} catch (error) {
			if (window.location.hash !== "" && window.location.hash !== "#" ) {
				window.location.href = "#"
			}
		}
	}
	
	const hasServersRunning = () => HTTPServerManager.list_web_servers_running.length > 0

	return hasServersRunning()
		? <HashRouter>
				<Routes>
				{
					GetRouteObject(routesConfig, mapper)
					.map(({ path, exact, element }:any, key) => <Route key={key}{...{ path, element }}/>)
				}
				</Routes>
			</HashRouter>
		: <div className="page page-center">
				<div className="container container-slim py-4">
					<div className="text-center">
						<div className="text-secondary mb-3">loading web services running...</div>
						<div className="progress progress-sm">
							<div className="progress-bar progress-bar-indeterminate"></div>
						</div>
					</div>
				</div>
			</div>
	
}

const mapDispatchToProps = (dispatch:any) =>
 bindActionCreators({
    SetHTTPServersRunning : HTTPServerManagerActionsCreator.SetHTTPServersRunning
}, dispatch)

const mapStateToProps = ({HTTPServerManager}:any) => ({
    HTTPServerManager
})
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)