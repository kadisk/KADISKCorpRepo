import * as React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const IntroducaoArticle = () => {

	return <div className="container-xl">
							<div className="row">
								<div className="col">
									<h3>Introdução</h3>
									<p>O My Platform temo o objetivo de ser um ecosistema completo.</p>
								
								</div>
							</div>
							<div className="row">
								<div className="col-12">
									<div>
										<div className="row">
									
										</div>
									</div>
								</div>
							</div>
						
						</div>
}

const mapDispatchToProps = (dispatch: any) =>
	bindActionCreators({

	}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => ({
	HTTPServerManager
})

export default connect(mapStateToProps, mapDispatchToProps)(IntroducaoArticle)