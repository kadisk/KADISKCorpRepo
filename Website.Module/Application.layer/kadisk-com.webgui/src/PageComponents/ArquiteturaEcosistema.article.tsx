import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const ArquiteturaEcosistemaArticle = () => {

	return <div className="container-xl">
				<div className="row">
					<div className="col">
						<h1>Arquitetura Ecosistema</h1>
						<p>O My Platform é um conjunto de componentes, que estão divididos em <strong>Essential</strong> e <strong>Ecosystem Core</strong></p>
						<h2>Repositório Essential</h2>
						<p>Contem os componentes essencial para a execução de um pacote</p>
						<h2>Repositório Ecosystem Core</h2>
						<p>Contem os componentes necessários para a execução de um ecosistemas</p>
					</div>
				</div>
			</div>
}

const mapDispatchToProps = (dispatch: any) => 
	bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => 
	({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ArquiteturaEcosistemaArticle)