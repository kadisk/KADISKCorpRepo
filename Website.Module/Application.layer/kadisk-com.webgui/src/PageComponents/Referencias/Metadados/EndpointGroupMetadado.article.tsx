import * as React from "react"

const EndpointMetadadoArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Metadados de Endpoint Group</h1>
					<p className="lead">
						Os metadados de <strong>grupos de endpoint</strong> descrevem os endpoints disponíveis
						para consumo pelo <code>metadata/boot.json</code> e por outros pacotes do sistema.
						Estes metadados são encontrados nos pacotes <em>webservice</em>, <em>webgui</em> e <em>webapp</em>.
					</p>

					<h2>Estrutura do Endpoint Group</h2>
					<p>
						Um grupo de endpoints é composto por parâmetros globais e uma lista de endpoints individuais.
					</p>

					<div className="card mt-4">
						<div className="card-header">
							<h3 className="mb-0">Parâmetros do Grupo</h3>
						</div>
						<div className="card-body">
							<div className="table-responsive">
								<table className="table table-striped">
									<thead>
										<tr>
											<th>Parâmetro</th>
											<th>Descrição</th>
											<th>Obrigatório</th>
											<th>Exemplo</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><code>bound-params</code></td>
											<td>
												Serviços e bibliotecas injetados como dependências para todos os endpoints do grupo
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>["serverService", "minhaNovaBibliotecaLib"]</code></td>
										</tr>
										<tr>
											<td><code>params</code></td>
											<td>
												Parâmetros estáticos disponíveis para todos os endpoints do grupo
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" disabled/>
												</div>
											</td>
											<td><code>["param1", "param2"]</code></td>
										</tr>
										<tr>
											<td><code>endpoints</code></td>
											<td>
												Lista de endpoints que compõem o grupo
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>[{"{...}"}]</code></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<h2 className="mt-5">Estrutura do Endpoint Individual</h2>
					<p>
						Cada endpoint dentro do grupo possui sua própria configuração específica.
					</p>

					<div className="card mt-3">
						<div className="card-header">
							<h3 className="mb-0">Parâmetros do Endpoint</h3>
						</div>
						<div className="card-body">
							<div className="table-responsive">
								<table className="table table-striped">
									<thead>
										<tr>
											<th>Parâmetro</th>
											<th>Descrição</th>
											<th>Obrigatório</th>
											<th>Exemplo</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><code>url</code></td>
											<td>
												URL do endpoint
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"/v1/example1"</code></td>
										</tr>
										<tr>
											<td><code>type</code></td>
											<td>
												Tipo do endpoint (<code>controller</code> ou <code>web-graphic-user-interface</code>)
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"controller"</code></td>
										</tr>
										<tr>
											<td><code>params</code></td>
											<td>
												Parâmetros específicos do endpoint, incluindo template da API e controlador
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>{"{...}"}</code></td>
										</tr>
										<tr>
											<td><code>bound-params</code></td>
											<td>
												Dependências específicas do endpoint. O <code>serverService</code> é obrigatório para endpoints do tipo controller
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>{"{serverService: 'serverService', ...}"}</code></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div className="alert alert-warning mt-4">
						<strong>Importante:</strong> O <code>serverService</code> é obrigatório no <code>bound-params</code> 
						do endpoint para que ele possa ser registrado corretamente no servidor.
					</div>

					<h2 className="mt-5">Exemplo Completo</h2>
					<p>
						Abaixo temos um exemplo de metadado que combina:
					</p>
					<ul>
						<li>Controller usado por <code>webservice</code> (<a href="#/documentation?articleUri=4.2">Referência de Pacote tipo Webservice</a>)</li>
						<li>Front-end usado por <code>webgui</code> (<a href="#/documentation?articleUri=4.3">Referência de Pacote tipo Webgui</a>)</li>
						<li>Ambos os componentes utilizados por <code>webapp</code> (<a href="#/documentation?articleUri=4.5">Referência de Pacote tipo Webapp</a>)</li>
					</ul>

					<div className="card bg-light">
						<div className="card-body">
							<pre className="mb-0">
{`{
    "bound-params": [
        "serverService", 
        "minhaNovaBibliotecaLib",
        "meuServicoExampleService"
    ],
    "params": [
        "serverManagerUrl", 
        "serverName",
        "RT_ENV_GENERATED_DIR_NAME",
        "?isWatch",
        "param1", 
        "param2"
    ],
    "endpoints": [
        {
            "url": "api/v1/example1",
            "type": "controller",
            "params": {
                "api-template": "APIs/Example1.api.json",
                "controller": "Controllers/Example1.controller"
            },
            "bound-params": {
                "serverService": "serverService",
                "controller-params": {
                    "bibliotecaLib": "minhaNovaBibliotecaLib"
                }
            }
        },
        {
            "url": "/",
            "type": "web-graphic-user-interface",
            "params": {
                "entrypoint": "index.tsx",
                "htmlTemplate": "index.html",
                "serverEndpointStatus": "{{serverManagerUrl}}",
                "serverName": "{{serverName}}",
                "RT_ENV_GENERATED_DIR_NAME": "{{RT_ENV_GENERATED_DIR_NAME}}"
            },
            "bound-params": {
                "serverService": "serverService"
            }
        }
    ]
}`}
							</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EndpointMetadadoArticle