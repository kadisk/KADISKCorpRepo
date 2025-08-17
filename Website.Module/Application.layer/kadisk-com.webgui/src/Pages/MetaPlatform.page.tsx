import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import backgroundImageUrl from "../../Assets/pexels-ivan-samkov-4491829_2-otimizada.jpg"

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

const MetaPlatformPage = ({
    queryParams,
    onChangeQueryParams,
    HTTPServerManager
}: HomepageContainerProps) => {

    return <>
        <div className="" >
            <div className="row" style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "bottom"
                }}>
                <div className="col-12" >
                    <header className="text-center pt-6">
                        <img src={logoMyPlatform} alt="logo" style={{ height: "100px" }}  className="me-2"/>
                    </header>
                    <main className="main mt-6">
                        <header className="text-center pb-0">
                            <div className="container">
                                <div>
                                    <p className="display-6">Construa um ecossistema flexível, onde cada componente se conecta e se transforma.</p>
                                    <p className="mt-4" style={{fontSize:"1rem"}}>Desenvolvida em Node.js, a MyPlatform facilita a transição para soluções mais ágeis e inovadoras.</p>
                                </div>
                                <div className="my-6">
                                    <div className="row flex-column justify-center">
                                        <div className="col-auto">
                                            <a href="#documentation" className="btn btn-lg btn-dark">
                                                Primeiros passos
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                    </main>
                </div>
            </div>
    
            <div className="container-fluid bg-gray-200">
                <div className="container py-6">
                    <h2>O MyPlatform é uma meta-framework, ela fornecer uma base sólida de componentes para que frameworks, ecosistemas, aplicações e serviços possam ser construidos de forma rápida e eficiente.</h2>
                    <p>O Meta Platform Setup Wizard é uma ferramenta de linha de comando feita pra ambientes GNU/Linux usada para configuração e instalação de ecossistemas padrão My Platform.Ele facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais do ecossistema estejam integrados e funcionando de maneira otimizada.</p>
                </div>
            </div>

            <div className="container-fluid">
                <div className="container py-6">
                    <h2>O MyPlatform é uma meta-framework, ela fornecer uma base sólida de componentes para que frameworks, ecosistemas, aplicações e serviços possam ser construidos de forma rápida e eficiente.</h2>
                    <div className="row">
                        <div className="col-12">
                            <p>O Meta Platform Setup Wizard é uma ferramenta de linha de comando feita pra ambientes GNU/Linux usada para configuração e instalação de ecossistemas padrão My Platform.Ele facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais do ecossistema estejam integrados e funcionando de maneira otimizada.</p>
                        </div>
                    </div>
                </div>
            </div>
           

            
        </div>
    </>
}

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({

    }, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => ({
    HTTPServerManager
})

export default connect(mapStateToProps, mapDispatchToProps)(MetaPlatformPage)