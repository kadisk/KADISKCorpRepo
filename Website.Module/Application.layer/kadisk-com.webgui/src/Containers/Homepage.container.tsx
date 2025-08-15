import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import backgroundImageUrl from "../../Assets/pexels-ruiz-15275312.jpg"

//@ts-ignore
import logo1svg from "../../Assets/logo.svg"

//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final.svg"

type HomepageParamsType = {
    api?: string
    summary?: string
}

type HomepageContainerProps = {
    queryParams: HomepageParamsType
    onChangeQueryParams: any
    HTTPServerManager: any
}

const HomepageContainer = ({
    queryParams,
    onChangeQueryParams,
    HTTPServerManager
}: HomepageContainerProps) => {

    return <div style={{
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "99vh"
            }}>
        <header className="header">
            <div className="p-6">
                <nav className="row items-center">
                    <div className="col">
                        <div className="d-flex items-center">
                            <img
                                src={logo1svg}
                                alt="logo"
                                style={{ height: "90px" }} 
                                className="me-2"/>
                        </div>
                    </div>
                </nav>
            </div>
        </header>   
        <main className="main mt-6">
            <header className="text-center pb-0">
                <div className="container" style={{color:"#697880ff"}}>
                    <div>
                        <p className="display-6">Apresentamos <img src={logoMyPlatform} alt="logo" style={{ height: "32px" }} />, o ecossistema que você controla.</p>
                        <p className="mt-4" style={{fontSize:"1.5rem"}}>Personalize, escale e evolua sem limites.</p>
                        <div className="my-6">
                            <div className="row flex-column justify-center">
                                <div className="col-auto">
                                    <button className="btn btn-lg btn-dark">
                                        Saiba mais
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </main>
        <footer className="py-3"  
            style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#313d3d",
            color: "#b7ccd1",
            zIndex: 1000
        }}>
            <div className="container">
                <div className="row py-2">
                    <div className="col-auto"><strong>© {new Date().getFullYear()} Kadisk Engenharia de Software LTDA. Todos os direitos reservados.</strong></div>
                </div>
            </div>
        </footer>
    </div>
}

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({

    }, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => ({
    HTTPServerManager
})

export default connect(mapStateToProps, mapDispatchToProps)(HomepageContainer)