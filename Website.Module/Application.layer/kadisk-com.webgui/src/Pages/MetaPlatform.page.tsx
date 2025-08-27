import * as React from "react"

//@ts-ignore
import backgroundImageUrl from "../../Assets/pexels-ivan-samkov-4491829_2-otimizada.jpg"

//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final.svg"

const MetaPlatformPage = () => {

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
                    <h2 className="mb-4">
                    MyPlatform: uma meta-framework para construção rápida e eficiente
                    </h2>
                    <p>
                    O MyPlatform é uma meta-framework que fornece uma base sólida de componentes, 
                    permitindo que frameworks, ecossistemas, aplicações e serviços sejam desenvolvidos 
                    de forma ágil e otimizada.
                    </p>
                </div>
            </div>


            <div className="container-fluid">
                <div className="container py-6">
                    <h2 className="mb-4">Repositórios</h2>

                    <div className="mb-5">
                    <h3 className="mb-2">Meta Platform Essential Repository</h3>
                    <p>
                        Este repositório reúne todos os componentes necessários para a execução 
                        de um ecossistema, além de ferramentas essenciais para sua manutenção.
                    </p>
                    </div>

                    <div>
                    <h3 className="mb-2">Meta Ecosystem Core Repository</h3>
                    <p>
                        Contém os componentes relacionados a serviços web e ferramentas de 
                        suporte e manutenção.
                    </p>
                    </div>
                </div>
            </div>
            <div className="container-fluid bg-gray-200">
                <div className="container py-6">
                    <h2 className="mb-4">Diferentes tipos de pacotes </h2>
                   <div className="row items-center">
                        <div className="col-12">
                            <div className="space-y-5">
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <h3>example-package.lib</h3>
                                            <p className="text-secondary m-0">São bibliotecas que podem ser usadas por outros pacotes, não é um pacote executável.</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <h3>example-package.webservice</h3>
                                            <p className="text-secondary m-0">Pacotes que fornece uma interface de comunição em rede de forma configuravel, usado para criar endpoints REST.e um variante especializada do service</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <h3>example-package.webgui</h3>
                                            <p className="text-secondary m-0">Pacote que fornece interface de rede e compilação de front-end, e um variante especializada do webservice</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <h3>example-package.service</h3>
                                            <p className="text-secondary m-0">Pacotes com serviços que podem ficar executando em segundo plano.</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <h3>example-package.webapp</h3>
                                            <p className="text-secondary m-0">Esse pacote agrupa todos os outro nele, é usado como o pacote principal geralmente a aplicação principal.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </>
}

export default MetaPlatformPage