import * as React from "react"

import WelcomeHeader from "../PageComponents/WelcomeHeader"
import WelcomeMenu from "../PageComponents/WelcomeMenu"
import WelcomeFooter from "../PageComponents/WelcomeFooter"

import GlobalStyle from "../Styles/Global.style"


const DefaultPage = ({
    children
}) => {
	return (
		<>
		<GlobalStyle />
			<div className="page">
				<div className="sticky-top">
					<WelcomeHeader/>
					<WelcomeMenu/>
				</div>
				<div className="page-wrapper">
					{children}
					<WelcomeFooter/>
				</div>
			</div>
		</>
	)
}

export default DefaultPage
