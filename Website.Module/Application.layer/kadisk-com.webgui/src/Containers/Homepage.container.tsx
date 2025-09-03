import * as React from "react"

//@ts-ignore
import backgroundImageUrl from "../../Assets/pexels-ruiz-15275312.jpg"

//@ts-ignore
import logo1svg from "../../Assets/logo.svg"

//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final.svg"


const HomepageContainer = () => {

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
                                    <a href="#meta-platform" className="btn btn-lg btn-dark">
                                        Saiba mais
                                    </a>
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
                    <div className="col-auto"><strong>© {new Date().getFullYear()} Kadisk Engenharia de Software LTDA. Todos os direitos reservados. </strong><i style={{ fontSize: "0.8rem" }}>
                        Atualizado em: { new Date(process.env.BUILD_DATE).toLocaleString("pt-BR")}</i>
                    </div>
                    
                </div>
            </div>
        </footer>
    </div>
}

export default HomepageContainer