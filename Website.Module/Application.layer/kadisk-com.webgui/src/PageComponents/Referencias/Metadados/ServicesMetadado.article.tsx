import * as React from "react"

const ServicesMetadadoArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Metadados de Serviços</h1>
					<p>
						Encontrados nos pacotes <em>service</em>, <em>app</em>, <em>cli</em> e <em>webapp</em>, 
						os metadados de <strong>serviço</strong> descrevem os serviços disponíveis para uso no sistema.
					</p>

					<h2>Exemplo de arquivo de metadado mínimo</h2>
					<pre>
{`[
    {
        "namespace": "Example",
        "path": "Services/Example.service"
    }
]`}
					</pre>

					<h2>Exemplo de código mínimo</h2>
					<pre>
{`const ExampleService = ({onReady}) => {
    onReady()
    return {}
}

module.exports = ExampleService`}
					</pre>

					<h2>Parâmetros por serviço</h2>
					<div className="card mt-3">
						<div className="table-responsive">
							<table className="table table-vcenter card-table table-striped">
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
										<td className="text-secondary">
											Identificador utilizado para referenciar o serviço durante a execução.
										</td>
										<td><input className="form-check-input" type="checkbox" checked disabled/></td>
										<td className="text-secondary">"MeuServicoExample"</td>
									</tr>
									<tr>
										<td><code>path</code></td>
										<td className="text-secondary">
											Caminho relativo do código-fonte do serviço dentro do projeto.
										</td>
										<td><input className="form-check-input" type="checkbox" checked disabled/></td>
										<td className="text-secondary">"Services/MeuServico.service"</td>
									</tr>
									<tr>
										<td><code>bound-params</code></td>
										<td className="text-secondary">
											Objetos injetados como dependências durante a execução.
										</td>
										<td><input className="form-check-input" type="checkbox" disabled/></td>
										<td className="text-secondary">["minhaNovaBibliotecaLib", "meuServicoExampleService"]</td>
									</tr>
									<tr>
										<td><code>params</code></td>
										<td className="text-secondary">
											Parâmetros estáticos definidos no metadado, como <em>strings</em> ou <em>números</em>.
										</td>
										<td><input className="form-check-input" type="checkbox" disabled/></td>
										<td className="text-secondary">["param1", "param2"]</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					
				</div>
			</div>
		</div>
	)
}

export default ServicesMetadadoArticle