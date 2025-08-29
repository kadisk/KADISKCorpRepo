import * as React from "react"

const CommandGroupMetadadoArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Metadados de Command Group</h1>
					<p>
						Os metadados de <strong>grupos de comandos</strong> descrevem os comandos disponíveis
						para consumo pelo <code>metadata/boot.json</code> para que possam ser usados como comandos por uma aplicação CLI.
						Estes metadados são encontrados em pacotes que fornecem funcionalidades de linha de comando.
					</p>

					<h2>Estrutura do Command Group</h2>
					<p>
						Um grupo de comandos é composto por uma lista de comandos individuais, cada um com seus parâmetros e configurações específicas.
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
											<td><code>commands</code></td>
											<td>
												Lista de comandos que compõem o grupo
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

					<h2 className="mt-5">Estrutura do Comando Individual</h2>
					<p>
						Cada comando dentro do grupo possui sua própria configuração específica, incluindo namespace, caminho para implementação, descrição e parâmetros.
					</p>

					<div className="card mt-3">
						<div className="card-header">
							<h3 className="mb-0">Parâmetros do Comando</h3>
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
											<td><code>namespace</code></td>
											<td>
												Namespace único para identificar o comando no sistema
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"MeuComando"</code></td>
										</tr>
										<tr>
											<td><code>path</code></td>
											<td>
												Caminho relativo para o arquivo que implementa o comando
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"Commands/MeuComando.command"</code></td>
										</tr>
										<tr>
											<td><code>command</code></td>
											<td>
												Padrão do comando como será usado na CLI, incluindo argumentos posicionais e opções
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"meu-comando [arg1]"</code></td>
										</tr>
										<tr>
											<td><code>description</code></td>
											<td>
												Descrição do comando que será exibida na ajuda da CLI
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"Meu comando"</code></td>
										</tr>
										<tr>
											<td><code>parameters</code></td>
											<td>
												Lista de parâmetros que o comando aceita
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" disabled/>
												</div>
											</td>
											<td><code>[{"{...}"}]</code></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<h2 className="mt-5">Estrutura dos Parâmetros do Comando</h2>
					<p>
						Cada parâmetro de um comando possui configurações específicas que definem seu comportamento na CLI.
					</p>

					<div className="card mt-3">
						<div className="card-header">
							<h3 className="mb-0">Parâmetros do Parâmetro</h3>
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
											<td><code>key</code></td>
											<td>
												Nome do parâmetro
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"arg1"</code></td>
										</tr>
										<tr>
											<td><code>paramType</code></td>
											<td>
												Tipo do parâmetro (<code>positional</code>, <code>option</code>, ou <code>flag</code>)
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"positional"</code></td>
										</tr>
										<tr>
											<td><code>valueType</code></td>
											<td>
												Tipo do valor aceito (<code>string</code>, <code>number</code>, <code>boolean</code>, <code>array</code>)
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" checked disabled/>
												</div>
											</td>
											<td><code>"string"</code></td>
										</tr>
										<tr>
											<td><code>describe</code></td>
											<td>
												Descrição do parâmetro que será exibida na ajuda da CLI
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" disabled/>
												</div>
											</td>
											<td><code>"um argumento"</code></td>
										</tr>
										<tr>
											<td><code>default</code></td>
											<td>
												Valor padrão para o parâmetro (opcional)
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" disabled/>
												</div>
											</td>
											<td><code>"valor-padrao"</code></td>
										</tr>
										<tr>
											<td><code>required</code></td>
											<td>
												Indica se o parâmetro é obrigatório
											</td>
											<td>
												<div className="form-check">
													<input className="form-check-input" type="checkbox" disabled/>
												</div>
											</td>
											<td><code>true</code></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<h2 className="mt-5">Exemplo Completo</h2>
					<p>
						Abaixo temos um exemplo de metadado de command group:
					</p>

					<div className="card bg-light">
						<div className="card-body">
							<pre className="mb-0">
{`{
    "commands": [
        {
            "namespace": "MeuComando",
            "path": "Commands/MeuComando.command",
            "command": "meu-comando [arg1]",
            "description": "Meu comando",
            "parameters": [
                {
                    "key": "arg1",
                    "paramType": "positional",
                    "valueType": "string",
                    "describe": "um argumento"
                }
            ]
        }
    ]
}`}
							</pre>
						</div>
					</div>

					<div className="alert alert-info mt-4">
						<strong>Nota:</strong> Os comandos definidos neste metadado estarão disponíveis para uso após o processo de boot do sistema através do <code>metadata/boot.json</code>.
					</div>
				</div>
			</div>
		</div>
	)
}

export default CommandGroupMetadadoArticle