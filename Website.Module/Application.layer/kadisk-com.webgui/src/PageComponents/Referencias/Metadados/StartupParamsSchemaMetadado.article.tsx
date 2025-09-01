import * as React from "react"

const StartupParamsSchemaMetadadoArticle = () => {

	return <div className="container-xl">		
		<div className="row">
			<div className="col">
				<h1>Metadado Startup Params Schema</h1>
				<p>
					É um json padrão json schema usado para validar o <code>metadata/startup-params.json</code>
				</p>
			</div>
		</div>
		<div className="row">
			<div className="col-12">
				<div className="alert alert-info">
					<div className="d-block">
						<h4>O que é JSON Schema?</h4>
						<p className="w-100">
							JSON Schema é um vocabulário que permite validar e documentar a estrutura de dados JSON. 
							Ele define as regras e restrições para objetos JSON, incluindo tipos de dados, formatos, 
							valores obrigatórios, enumerações e muito mais.
						</p>
						<p className="w-100 mb-0">
							<a href="https://json-schema.org/learn/getting-started-step-by-step" 
								target="_blank" 
								rel="noopener noreferrer"
								className="btn btn-primary">
								Saiba mais sobre JSON Schema
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default StartupParamsSchemaMetadadoArticle