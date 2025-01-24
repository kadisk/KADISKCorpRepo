import * as React from "react"

import WelcomeHeader from "../PageComponents/WelcomeHeader"
import WelcomeMenu from "../PageComponents/WelcomeMenu"
import WelcomeFooter from "../PageComponents/WelcomeFooter"

import UserAdministrationContainer from "../Containers/UserAdministration.container"

const WelcomePage = () => {
	return (
		<>
			<div className="page">
				<div className="sticky-top">
					<WelcomeHeader />
					<WelcomeMenu />
				</div>
				<div className="page-wrapper">
					<UserAdministrationContainer />
					<WelcomeFooter />
				</div>
			</div>
			<div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block" }}>
				<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">New user</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label className="form-label">Name</label>
								<input
									type="text"
									className="form-control"
									name="example-text-input"
									placeholder="Your report name"
								/>
							</div>
						</div>

						<div className="modal-footer">
							<a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
								Cancel
							</a>
							<a href="#" className="btn btn-primary ms-auto" data-bs-dismiss="modal">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M12 5l0 14" />
									<path d="M5 12l14 0" />
								</svg>
								Create new user
							</a>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}

export default WelcomePage
