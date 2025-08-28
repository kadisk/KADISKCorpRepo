import React from "react"

const PackageMetadadoArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Metadado do Package</h1>

					<p>
						O arquivo de metadado <code>package.json</code> deve conter a definição do seu{" "}
						<code>namespace</code>.  
						Atualmente, essa é a única propriedade obrigatória do arquivo.  
						O <code>namespace</code> deve ser único dentro do ecossistema e atua como identificador universal 
						do pacote, permitindo que ele seja localizado e referenciado por outros pacotes:
					</p>

					<pre>
{`{
  "namespace": "@/minha-novo-biblioteca.lib"
}`}
					</pre>
					<div className="alert alert-warning mt-4">
						É importante ressaltar que, por enquanto, o identificador namespace é único em todo o ecossistema.Isto significa que duplicações — mesmo em repositórios diferentes — podem causar problemas durante a execução. Em versões futuras, será possível reutilizar o mesmo identificador em diferentes contextos, o que aumentará a flexibilidade na organização dos pacotes.
					</div>
				</div>
			</div>
		</div>
	)
}

export default PackageMetadadoArticle
