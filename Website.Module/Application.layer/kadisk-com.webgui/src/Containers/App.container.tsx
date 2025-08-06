import * as React             from "react"
import {useEffect}            from "react"

//@ts-ignore
import { Routes, BrowserRouter, HashRouter, Route }  from "react-router-dom"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import axios                  from "axios"

import HTTPServerManagerActionsCreator from "../Actions/HTTPServerManager.actionsCreator"

const fetchHTTPServersRunning = async () => {
    // @ts-ignore
    const {data} = await axios.get(process.env.HTTP_SERVER_MANAGER_ENDPOINT)
    return data
}

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

interface AppRoutesProps {
    routesConfig:any[]
    mapper:any
}

const AppRoutes = ({routesConfig, mapper}:AppRoutesProps) => {
    const routesObject = GetRouteObject(routesConfig, mapper)
    //const routes = useRoutes(routesObject)
    console.log(routesObject)
    return 
}

const AppContainer = ({
    routesConfig,
    mapper,
    HTTPServerManager, 
    SetHTTPServersRunning
}:AppContainerProps) => {

    useEffect(()=>{
        fetchHTTPServersRunning()
        .then(webServersRunning => SetHTTPServersRunning(webServersRunning))
    }, [])
    
    return HTTPServerManager.list_web_servers_running.length > 0 
        ? <HashRouter>
                <Routes>
                {
                    GetRouteObject(routesConfig, mapper)
                    .map(({ path, exact, element }:any, key) => <Route key={key}{...{ path, element }}/>)
                }
                </Routes>
            </HashRouter>
        : (
            <div className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{width: "3rem", height: "3rem"}}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div>loading web services running...</div>
                </div>
            </div>
        )
    
}

const mapDispatchToProps = (dispatch:any) =>
 bindActionCreators({
    SetHTTPServersRunning : HTTPServerManagerActionsCreator.SetHTTPServersRunning
}, dispatch)

const mapStateToProps = ({HTTPServerManager}:any) => ({
    HTTPServerManager
})
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)