import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

const PacotesEMetadadosArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Pacotes e Metadados</h1>

					<h2>Pacotes</h2>
					<p>
						Na <strong>Meta Platform</strong>, os pacotes são blocos fundamentais para a construção do ecossistema. 
						Eles servem como base para aplicações, armazenando tanto o código-fonte quanto metadados que definem seu tipo e comportamento. 
						Um pacote pode ter dois propósitos principais:
					</p>
					<ul>
						<li>Ser utilizado por outros pacotes como dependência;</li>
						<li>Ser executado como uma aplicação.</li>
					</ul>

					<h3>Tipos de Pacotes</h3>
					<p>Atualmente, existem os seguintes tipos de pacotes:</p>
					<ul>
						<li>
							<strong>lib</strong> – Pacote de biblioteca. Agrupa trechos de código reutilizáveis, 
							evitando duplicações em diferentes partes do sistema.
						</li>
						<li>
							<strong>service</strong> – Pacote de serviço. Contém regras e lógicas de negócio que 
							podem ser consumidas por outros pacotes. Diferente de <em>lib</em>, expõe funcionalidades completas.
						</li>
						<li>
							<strong>webservice</strong> – Especialização de <em>service</em>, voltada para comunicação com outras aplicações. 
							Fornece interfaces como REST, WebSocket, gRPC, entre outras.
						</li>
						<li>
							<strong>webgui</strong> – Especialização de <em>webservice</em>, dedicada ao front-end. 
							Disponibiliza a interface gráfica e é responsável pelo processo de build.
						</li>
						<li>
							<strong>app</strong> – Pacote do tipo aplicação. Atua como container que combina diferentes pacotes 
							para formar um programa executável localmente.
						</li>
						<li>
							<strong>webapp</strong> – Especialização de <em>app</em>, projetada para rodar como aplicação web.
						</li>
						<li>
							<strong>cli</strong> – Especialização de <em>app</em>, voltada para aplicativos de linha de comando.
						</li>
					</ul>

					<h2>Metadados</h2>
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
							<strong>boot.json</strong> – Define como o pacote será executado. Presente em pacotes executáveis.
						</li>
						<li>
							<strong>startup-params.json</strong> e <strong>startup-params-schema.json</strong> – 
							Disponíveis apenas em pacotes que possuem <code>boot.json</code>. 
							Definem parâmetros de inicialização: o primeiro fornece valores padrão de execução e 
							o segundo descreve a estrutura esperada desses parâmetros.
						</li>
						<li>
							<strong>services.json</strong> – Encontrado em pacotes <em>service</em>, <em>app</em>, <em>cli</em> e <em>webapp</em>. 
							Descreve os serviços e endpoints disponíveis para uso.
						</li>
						<li>
							<strong>endpoint-group.json</strong> – Presente em pacotes <em>webservice</em>, <em>webgui</em> e <em>webapp</em>. 
							Define grupos de endpoints expostos.
						</li>
						<li>
							<strong>command-group.json</strong> – Exclusivo de pacotes <em>cli</em>. 
							Lista os comandos disponíveis que podem ser executados na aplicação.
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

const mapDispatchToProps = (dispatch: any) =>
	bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) =>
	({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(PacotesEMetadadosArticle)
