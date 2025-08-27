import * as React from "react"

const PrimeirosPassosArticle = () => {

	return <div className="container-xl">
							<div className="row">
								<div className="col">
									<h3>Executor de Pacotes</h3>
									<p>Para executar os ecossitema e seus pacotes é necessario que o packace-executor(<a href="https://github.com/Meta-Platform/meta-platform-package-executor-command-line">Executor de Pacotes da Plataforma</a>) esteja instalado em seu ambiente de execução e o comando <code>pkg-exec</code>.</p>
									<pre>
										<code>
											npm install -g package-executor
										</code>
									</pre>
									<pre>
										<code>
											pkg-exec
										</code>
									</pre>
									<pre>{`
Opções:
      --version                             Exibe a versão                                                                       [booleano]
      --package                             Caminho do pacote                                                                    [string] [obrigatório]
      --startupJson                         Caminho do arquivo JSON com os parâmetros de inicialização                           [string] [obrigatório]
      --ecosystemData                       Caminho do diretório EcosystemData válido                                            [string] [obrigatório]
      --ecosystemDefault                    Caminho do arquivo JSON de parâmetros da plataforma                                  [string] [obrigatório]
      --nodejsProjectDependencies           Caminho do projeto com as dependências nodejs para execução do pacote do ecossistema [string] [obrigatório]
      --awaitFirstConnectionWithLogStreami  Aguardar pela primeira conexão com ng streaming de logs                              [booleano] [padrão: false]
      --supervisorSocket                    Caminho onde será criado o socket de supervisão do processo executor de pacotes      [string] [padrão: false]
      --executableName                      Nome do executável para pacote de linha de comando                                   [string] [padrão: false]
      --commandLineArgs                     Argumentos para o executable de linha de comando                                     [string] [padrão: false]
      --verbose                             Aguardar pela primeira conexão com streaming de logs                                 [booleano] [padrão: false]
  -h, --help                                Exibe ajuda                                                                          [booleano]

Faltando argumentos obrigatórios: package, startupJson, ecosystemData, ecosystemDefault, nodejsProjectDependencies
									`}</pre>
								</div>
							</div>
							<div className="row">
								<div className="col-12">
									<div>
										<div className="row">
											<div className="col">
												<h3>Setup Wizard</h3>
												<p>Atualmente, a forma mais rápida de instalar um ecossistema é utilizando a ferramenta oficial de linha de comando mywizard <a href="https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line">Meta Platform Setup Wizard</a>.
Desenvolvida para ambientes GNU/Linux, ela permite configurar e instalar ecossistemas padrão My Platform de maneira simples. A ferramenta facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais estejam integrados e funcionando de forma otimizada.</p>
												<div>
													<pre>
														<code>
															npx mywizard --help
														</code>
													</pre>
													<pre>{`
mywizard [comando]

Comandos:
mywizard list-profiles             Exibe os perfis de instalação disponíveis
mywizard install [profile]         Instala um ecosistema conforme o [installation-path] perfil especificado
mywizard update [profile]          Atualiza os repositórios, [installation-path] executáveis e binários de um ecosistema instalado
mywizard show-profile [profile]    Mostra informações sobre um perfil especifico

Opções:
--help     Exibe ajuda			[booleano]
--version  Exibe a versão		[booleano]
												`}</pre>
												</div>
												
												<p>Para instalar um ecosistema utilizando o perfil de instalação <i>standard</i> por padrão</p>
												<div>
													<pre>
														<code>
															mywizard install release-standard
														</code>
													</pre>
													<p className="text-secondary">Certifique-se de ter o <code>mywizard</code> instalado no seu sistema ou use <code>npx mywizard ...</code>. Tambem exista a opção de um binário equivalente <a href="https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64">aqui</a> para ou <code>wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 -O mywizard</code>.</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<h3>Configurando o PATH no .bashrc</h3>
									<p>Para que o sistema reconheça os comandos e executáveis do ecossistema, é necessário adicionar o diretório EcosystemData à variável de ambiente PATH. Siga os passos abaixo:</p>
									<pre>
										<code>
											{`echo 'export PATH="$PATH:~/EcosystemData/executables"' >> ~/.bashrc && source ~/.bashrc`}
										</code>
									</pre>
									Verifique com
									<pre>
										<code>
											repo list installed
										</code>
{`
	1. EssentialRepo
	2. EcosystemCoreRepo
`}
									</pre>
								</div>
							</div>
						</div>
}

export default PrimeirosPassosArticle