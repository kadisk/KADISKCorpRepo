import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const ServicesMetadadoArticle = () => {

	return <div className="container-xl">
				<div className="row">
					<div className="col">
					<h1>Metadado Services</h1>
					<p>
						O arquivo de metadado <code>package.json</code> pode ser criado em pacotes como <em>service</em>, <em>app</em>, <em>cli</em> e <em>webapp</em>. 
						mais usado somente por pacotes que contenha o metadado <code>boot.json</code>
					</p>
										<pre>
{`[
    {
        "namespace": "MeuServicoExample",
        "path": "Services/MeuServico.service",
        "bound-params":[
            "minhaNovoBibliotecaLib",
            "meuServicoExampleService"
        ],
        "params": [
            "param1",
            "param2"
        ]
    }
]`}
					</pre>
					</div>
				</div>
			</div>

}

const mapDispatchToProps = (dispatch: any) => 
	bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => 
	({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ServicesMetadadoArticle)