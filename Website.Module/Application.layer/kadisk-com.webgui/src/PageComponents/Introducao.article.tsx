import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const IntroducaoArticle = () => {

	return <div className="container-xl">
				<div className="row">
					<div className="col">
						<h1>Introdução</h1>
						<p>AQUI DEVE TER UM INTRO EXPLICANDO COMO CRIAR UM PRIMEIRO PACOTE</p>
						{/*  */}
					</div>
				</div>
			</div>
}

const mapDispatchToProps = (dispatch: any) => 
	bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => 
	({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(IntroducaoArticle)