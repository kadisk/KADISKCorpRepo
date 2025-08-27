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

					<h2>Parâmetros</h2>
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

					<h2 className="mt-4">Criando um novo serviço</h2>
					<p>
						Para criar um novo serviço, além do arquivo <code>metadata/services.json</code>, 
						é necessário implementar o código correspondente ao definido nos metadados.
					</p>
					<p>
						Todo o código fonte deve ser criado dentro do diretório <code>src</code>, e o arquivo 
						deve seguir o padrão CommonJS. De acordo com o exemplo, onde o campo <code>path</code> 
						do metadado está definido como <code>"Services/MeuServico.service"</code>, o arquivo 
						deve estar localizado em <code>src/Services/MeuServico.service.js</code>. Este arquivo 
						exporta funções que serão utilizadas por outros serviços. É obrigatório chamar a função 
						<code>onReady</code> recebida como parâmetro para sinalizar que o serviço está pronto para uso.
					</p>

					<h3>Exemplo de implementação</h3>
					<p>Arquivo <code>metadata/services.json</code>:</p>
					<pre>
{`[
    {
        "namespace": "MeuServicoExample",
        "path": "Services/MeuServico.service",
        "bound-params": [
            "minhaNovaBibliotecaLib",
            "meuServicoExampleService"
        ],
        "params": [
            "param1",
            "param2"
        ]
    }
]`}
					</pre>
					
					<p>Arquivo <code>Services/MeuServico.service.js</code>:</p>
					<pre>
{`const MeuServicoService = (params) => {
    const {
        minhaNovaBibliotecaLib,
        meuServicoExampleService,
        param1,
        param2,
        onReady 
    } = params

    const SomeFunction = minhaNovaBibliotecaLib.require("Utils/SomeFunction")

    const _Start = async () => {
        onReady()
    }

    const GetSomeValue = () => {
        return param1 + param2
    }

    const DoSomething = () => {
        SomeFunction()
    }

    const DoOtherThings = async () => {
        const data = await meuServicoExampleService.GetData()
        return data
    }

    _Start()

    return {
        DoSomething,
        DoOtherThings,
        GetSomeValue
    }
}

module.exports = MeuServicoService`}
					</pre>
					
					<p>
						Este exemplo demonstra um serviço que recebe tanto parâmetros estáticos (<code>param1</code> e <code>param2</code>) 
						quanto dependências de outros serviços (<code>meuServicoExampleService</code>) e bibliotecas 
						(<code>minhaNovaBibliotecaLib</code>). Neste caso, utilizamos a função <code>SomeFunction</code> 
						da biblioteca <code>minhaNovaBibliotecaLib</code>.
					</p>
				</div>
			</div>
		</div>
	)
}

export default ServicesMetadadoArticle