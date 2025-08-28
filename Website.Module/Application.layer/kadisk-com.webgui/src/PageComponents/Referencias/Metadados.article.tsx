import * as React from "react"

const MetadadosArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Metadados</h1>
					<p>
						Todo pacote da plataforma possui um diretório chamado <code>metadata</code>. 
						O conteúdo desse diretório, combinado com o tipo do pacote, define o seu comportamento.  
					</p>
					<p>
						Por exemplo, todo pacote que contém o arquivo <code>boot.json</code> é considerado executável. 
						Portanto, esse arquivo não é obrigatório em pacotes do tipo <em>lib</em>, <em>service</em>, 
						<em>webservice</em> ou <em>webgui</em>, mas é essencial em <em>app</em>, <em>webapp</em> e <em>cli</em>. 
					</p>
					<p>
						Além disso, todos os pacotes devem possuir um arquivo <code>package.json</code> com a definição do seu <code>namespace</code>.  
						O namespace é obrigatório, único dentro do ecossistema e atua como identificador universal do pacote, 
						permitindo que ele seja encontrado por outros pacotes:
					</p>

					<pre>
{`{
  "namespace": "@/meu-novo-pacote.service"
}`}
					</pre>

					<h3>Arquivos de Metadados Disponíveis</h3>
					<ul>
						<li>
							<strong>boot.json</strong> – Define como o pacote será executado. Presente em pacotes executáveis.Saiba mais em <a href="#/documentation?articleUri=3.4">Referência de metadado Inicialização</a>
						</li>
						<li>
							<strong>startup-params.json</strong> e <strong>startup-params-schema.json</strong> – 
							Disponíveis apenas em pacotes que possuem <code>boot.json</code>. 
							Definem parâmetros de inicialização: o primeiro fornece valores padrão de execução e 
							o segundo descreve a estrutura esperada desses parâmetros.Saiba mais em Referência de metadado <a href="#/documentation?articleUri=3.5">Paramêtros de Inicialização</a> e <a href="#/documentation?articleUri=3.5.0">Esquema de Paramêtros de Inicialização</a>
						</li>
						<li>
							<strong>services.json</strong> – Encontrado em pacotes <em>service</em>, <em>app</em>, <em>cli</em> e <em>webapp</em>. 
							Descreve os serviços disponíveis para uso.Saiba mais em <a href="#/documentation?articleUri=3.1">Referência de metadado Serviço</a>
						</li>
						<li>
							<strong>endpoint-group.json</strong> – Presente em pacotes <em>webservice</em>, <em>webgui</em> e <em>webapp</em>. 
							Define grupos de endpoints expostos.Saiba mais em <a href="#/documentation?articleUri=3.2">Referência de metadado de Serviços Web</a>
						</li>
						<li>
							<strong>command-group.json</strong> – Exclusivo de pacotes <em>cli</em>. 
							Lista os comandos disponíveis que podem ser executados na aplicação.Saiba mais em <a href="#/documentation?articleUri=3.3">Referência de metadado de comandos</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default MetadadosArticle
