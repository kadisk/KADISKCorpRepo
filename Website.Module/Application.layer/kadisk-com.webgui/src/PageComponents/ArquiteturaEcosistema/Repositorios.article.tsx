import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const RepositoriosArticle = () => {
	return (
		<div className="container-xl">
			<div className="row">
				<div className="col">
					<h1>Repositórios</h1>
					<p>
						Na <strong>Meta Platform</strong>, um repositório é o componente central do ecossistema. 
						Ele atua como um contêiner capaz de organizar e reunir todos os demais tipos de componentes, 
						sendo, portanto, a unidade mais importante dentro da arquitetura.
					</p>
					<p>
						Um repositório é estruturado em <strong>Modules</strong>, que por sua vez são divididos em <strong>Layers</strong>. 
						Nessas camadas ficam os pacotes, que, quando necessário, podem ser agrupados em <strong>Groups</strong>.  
					</p>
					<p>
						Na raiz de cada repositório existe o diretório <code>metadata</code>, contendo o arquivo 
						<code>application.json</code>. Esse arquivo descreve as informações de instalação de aplicações 
						executáveis prontas para uso, que podem ser integradas diretamente ao ecossistema.
					</p>
					<p>
						O <code>application.json</code> define um array de objetos que descrevem os aplicativos disponíveis. 
						Cada objeto contém informações como o tipo da aplicação (<code>appType</code>), o nome do executável, 
						o namespace do pacote e o socket de controle/monitoramento. Atualmente, os tipos suportados são <strong>APP</strong> e <strong>CLI</strong>.
					</p>
					<p>Exemplo de configuração em <code>application.json</code>:</p>
					<pre>
{`{
    "appType": "APP",
    "executable": "mywebsite",
    "packageNamespace": "Website.Module/Application.layer/my-website.webapp",
    "supervisorSocketFileName": "mywebsite.sock"
}`}
					</pre>
					<p>Exemplo de instalação e uso:</p>
					<pre>
{`repo register source ExampleRepo LOCAL_FS --localPath ~/example-repo`}
					</pre>					
					<pre>
{`repo install ExampleRepo LOCAL_FS --executables "mywebsite"`}
					</pre>
				</div>
			</div>
		</div>
	)
}

const mapDispatchToProps = (dispatch: any) =>
	bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) =>
	({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositoriosArticle)
