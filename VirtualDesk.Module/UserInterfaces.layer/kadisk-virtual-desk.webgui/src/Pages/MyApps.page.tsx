import * as React from "react"

import DefaultPage from "../Components/DefaultPage"

const MyAppsPage = () =>
	<DefaultPage>
		<div className="page-body">
			<div className="container-xl d-flex flex-column justify-content-center">
				<div className="empty">
					<p className="empty-title">Você não possui nenhum "MyApp" ativado no momento!</p>
					<p className="empty-subtitle text-secondary">
						Para utilizar os aplicativos, é necessário ativá-los e, em alguns casos, configurá-los previamente, especialmente para apps mais complexos, quando aplicável.
					</p>
					<div className="empty-action">
						<button className="btn btn-primary">
							Ativar o meu primeiro <strong> "MyApp"</strong>
						</button>
					</div>
				</div>
			</div>
		</div>
	</DefaultPage>


export default MyAppsPage
