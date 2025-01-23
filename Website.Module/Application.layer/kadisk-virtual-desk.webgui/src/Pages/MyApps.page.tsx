import * as React from "react"

import WelcomeHeader from "../PageComponents/WelcomeHeader"
import WelcomeMenu from "../PageComponents/WelcomeMenu"
import WelcomeFooter from "../PageComponents/WelcomeFooter"

const WelcomePage = () => {
	return (
		<>
			<div className="page">
				<div className="sticky-top">
					<WelcomeHeader/>
					<WelcomeMenu/>
				</div>
				<div className="page-wrapper">
					<WelcomeFooter/>
				</div>
			</div>
		</>
	)
}

export default WelcomePage
