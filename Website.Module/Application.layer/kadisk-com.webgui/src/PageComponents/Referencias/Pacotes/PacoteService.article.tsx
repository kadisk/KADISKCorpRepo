import * as React from "react"

const PacoteServiceArticle = () => {
    return (
        <div className="container-xl">
            <div className="row">
                <div className="col">
                    <h1>Pacote tipo Service</h1>
                    <p>
                        Pacotes do tipo service não são executados diretamente, mas são utilizados por outros pacotes que contenham boot.
                        Sua principal diferença em relação às bibliotecas, em termos de funcionalidade, é que geralmente executam uma lógica de negócio mais completa e avançada,
                        podendo combinar outros serviços e bibliotecas de diferentes pacotes.
                    </p>
					<h2 className="mt-4">Criando um novo serviço</h2>
					<p>
						Para criar um novo serviço, além do arquivo <code>metadata/services.json</code>, 
						é necessário implementar o código correspondente ao definido na <a href="#/documentation?articleUri=3.1">Referência de Metadado de Serviço</a>.
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

export default PacoteServiceArticle