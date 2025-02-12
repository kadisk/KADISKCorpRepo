import * as React from "react"

import DefaultPage from "../Components/DefaultPage"

const MyAppsPage = () =>
	<DefaultPage>
		<div className="page-body d-flex flex-column justify-content-center align-items-center text-center py-5">
			<div className="container-xl">
				<div className="empty">
					<h1 className="empty-title">No applications activated</h1>
					<p className="empty-subtitle text-secondary">
						To use the applications, activate and configure them as needed. Some more complex applications may require additional settings.
					</p>
					<div className="empty-action d-flex gap-3">
						<button className="btn btn-primary">
							Activate my first application
						</button>
					</div>
				</div>
			</div>
		</div>
	</DefaultPage>


export default MyAppsPage
