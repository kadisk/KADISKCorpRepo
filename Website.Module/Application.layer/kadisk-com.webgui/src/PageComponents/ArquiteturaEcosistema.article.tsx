import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const ArquiteturaEcosistemaArticle = () => {

	return <div className="container-xl">
				<div className="row">
					<div className="col">
						<h1>Arquitetura do Ecossistema</h1>
						<p>
							O <strong>My Platform</strong> é composto por um conjunto de componentes organizados em dois repositórios principais: 
							<strong> Essential</strong> e <strong>Ecosystem Core</strong>. 
						</p>
						<p>
							O <strong>Repositório Essential</strong> reúne os componentes fundamentais para execução de pacotes e manipulação básica de repositórios. 
							Já o <strong>Repositório Ecosystem Core</strong> concentra os elementos necessários para criação, execução e gestão de um ecossistema completo.
						</p>
					</div>
				</div>
			</div>

}

const mapDispatchToProps = (dispatch: any) => 
	bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => 
	({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ArquiteturaEcosistemaArticle)