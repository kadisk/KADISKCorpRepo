import * as React from "react"

import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import backgroundImageUrl from "../../Assets/pexels-g-cortez-1520507-9139967.jpg"

//@ts-ignore
import logo1svg from "../../Assets/logo.svg"

type HomepageParamsType = {
    api     ?: string
    summary ?: string
}

type HomepageContainerProps = {
    queryParams         : HomepageParamsType
    onChangeQueryParams : any
    HTTPServerManager   : any
}

const SERVER_APP_NAME = process.env.SERVER_APP_NAME

const HomepageContainer = ({
    queryParams,
    onChangeQueryParams, 
    HTTPServerManager
}:HomepageContainerProps) => {

    return <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-0 rounded-0 py-3">
            <div className="container-fluid">
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/desk">
                                Virtual Desk
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div
            style={{
                padding: "1em 0em",
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "87vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        >
            <div className="container-fluid">
                <img alt='logo' src={logo1svg} style={{marginLeft: "15px", width: "40vh"}}/>
            </div>
        </div>
        <footer className="footer bg-dark text-white py-4">
            <div className="container text-center">
                <p className="mb-0">
                    © {new Date().getFullYear()} Kadisk Engenharia de Software LTDA. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    </>
}

const mapDispatchToProps = (dispatch:any) =>
 bindActionCreators({

}, dispatch)

const mapStateToProps = ({HTTPServerManager}:any) => ({
    HTTPServerManager
})

export default connect(mapStateToProps, mapDispatchToProps)(HomepageContainer)