import * as React from "react"

const BootMetadadoArticle = () => {

	return <div className="container-xl">
				<div className="row">
					<div className="col">
					<h1>Metadado Boot</h1>
					<p>
						Todo pacote executavel deve conter um arquivo de metadado com <code>boot.json</code> ele é o ponto de central na definição de como um pacote irá 
						executar
						
					</p>
					<h2>Estrutura do boot</h2>
					<p>nenhum dos atributos é obrigatório isso significa que <code>{}</code> é um <code>metadata/boot.json</code> válido</p>
					<pre className="mb-0">
{`{
    "params" : [],
    "services" :[],
    "endpoints" : [],
    "executables" :[]
}`}
							</pre>
					</div>
				<h3>Atributo <code>params</code></h3>
				<h3>Atributo <code>services</code></h3>
				<h3>Atributo <code>endpoints</code></h3>
				<h3>Atributo <code>executables</code></h3>
				</div>
			</div>

}


export default BootMetadadoArticle