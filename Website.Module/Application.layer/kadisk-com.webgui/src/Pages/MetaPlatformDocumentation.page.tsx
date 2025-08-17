import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import backgroundImageUrl from "../../Assets/pexels-ivan-samkov-4491829_2-otimizada.jpg"

//@ts-ignore
import logoMyPlatform from "../../Assets/logo-my-platform-final-write.svg"

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

	return <div className="page">
				<aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
					<div className="container-fluid">
						<div className="navbar-brand px-3">
							<a href="#meta-platform"><img src={logoMyPlatform}/></a>
						</div>
						<div className="collapse navbar-collapse">
							<ul className="navbar-nav">
								<li className="nav-item">
									<a className="nav-link">
										<span className="nav-link-title">Primeiros passos</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</aside>
				<div className="page-wrapper">
					<div className="page-header d-print-none" aria-label="Page header">
						<div className="container-xl">
							<div className="row g-2 align-items-center">
								<div className="col">
									<div className="page-pretitle">Primeiros Passos</div>
									<h2 className="page-title">Instalando um ecosistema localmente</h2>
								</div>
							</div>
						</div>
					</div>
					<div className="page-body">
						<div className="container-xl">
							<div className="row items-center">
								<div className="col-12">
									<div className="space-y-5">
										<div>
											<div className="row">
												<div className="col">
													<p>Atualmente, a forma mais rápida de instalar um ecossistema é utilizando a ferramenta oficial de linha de comando <a href="https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line">Meta Platform Setup Wizard</a>. Desenvolvida para ambientes GNU/Linux, ela permite configurar e instalar ecossistemas padrão My Platform de maneira simples. A ferramenta facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais estejam integrados e funcionando de forma otimizada.</p>
													<h3>Obtendo o Setup Wizard</h3>
													<p>Para obter a ferramenta, você pode baixá-la diretamente do repositório oficial no GitHub. Use o comando abaixo para fazer o download da versão mais recente:</p>
													<div>
														<pre>
															<code>
																wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 -O mywizard
															</code>
														</pre>
													</div>
													<p className="text-secondary">Certifique-se de ter o <code>wget</code> instalado no seu sistema. Caso não queira <a href="https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64">clique aqui</a> para baixar manualmente.</p>
													<p>Após o download, você precisará tornar o arquivo executável. Use o comando <code>chmod +x</code> para isso:</p>
													<div>
														<pre>
															<code>
																chmod +x mywizard
															</code>
														</pre>
													</div>
													<p>Agora, você pode executar o Setup Wizard diretamente do terminal. Para listar os perfis de ecossistemas disponíveis, utilize o seguinte comando:</p>
													<h4>Exemplo de comandos</h4>
													<div>
														<pre>
															<code>
																./mywizard list-profiles
															</code>
														</pre>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
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