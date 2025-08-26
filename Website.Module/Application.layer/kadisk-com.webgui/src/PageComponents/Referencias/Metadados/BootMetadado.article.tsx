import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const BootMetadadoArticle = () => {

	return <div className="container-xl">
				<div className="row">
					<div className="col">
					<h1>Metadado Boot</h1>
					<p>
						Todo pacote executavel deve conter um arquivo de metadado com <code>boot.json</code> ele é o ponto de central na definição de como um pacote irá InstanceExecutorControlPanel
						
					</p>
					</div>
				</div>
			</div>

}

const mapDispatchToProps = (dispatch: any) => 
	bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => 
	({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(BootMetadadoArticle)