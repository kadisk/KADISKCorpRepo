import * as React from "react"
import GlobalStyle from "../Styles/Global.style"

import DefaultHeaderPage from "./DefaultHeaderPage"
import WelcomeFooter from "../PageComponents/WelcomeFooter"

const BasePage = ({
    children
}) => {
	return (
		<>
		    <GlobalStyle />
			<div className="page">
				{children}
			</div>
		</>
	)
}

export default BasePage
