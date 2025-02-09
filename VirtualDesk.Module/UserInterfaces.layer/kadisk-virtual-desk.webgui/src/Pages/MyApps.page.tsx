import * as React from "react"

import DefaultPage from "../Components/DefaultPage"

const MyAppsPage = () =>
	<DefaultPage>
		<div className="page-body d-flex flex-column justify-content-center align-items-center text-center py-5">
			<div className="container-xl">
				<div className="empty">
					<h1 className="empty-title">Nenhum aplicativo ativado</h1>
					<p className="empty-subtitle text-secondary">
						Para utilizar os aplicativos, ative e configure-os conforme necessário. Alguns aplicativos mais complexos podem exigir configurações adicionais.
					</p>
					<div className="empty-action d-flex gap-3">
						<button className="btn btn-primary">
							Ativar meu primeiro aplicativo
						</button>
					</div>
				</div>
			</div>
		</div>
	</DefaultPage>


export default MyAppsPage
