import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

const MyWorkspaces = () => {
	return <DefaultPageWithTitle title="My Workspaces" preTitle="Workbench">
		<div className="container-xl d-flex flex-column justify-content-center align-items-center text-center py-5">
			<div className="empty">
				<h1 className="empty-title">Nenhum repositório encontrado</h1>
				<p className="empty-subtitle text-secondary">
					Para começar, você pode criar um novo repositório ou importar um existente.
				</p>
				<div className="empty-action d-flex gap-3">
					<button className="btn btn-primary">
						Criar novo repositório
					</button>
					<button className="btn btn-outline-primary">
						Importar repositório existente
					</button>
				</div>
			</div>
		</div>
	</DefaultPageWithTitle>
}

export default MyWorkspaces
