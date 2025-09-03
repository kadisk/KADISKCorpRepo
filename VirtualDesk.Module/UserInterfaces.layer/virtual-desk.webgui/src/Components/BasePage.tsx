import * as React from "react"
import GlobalStyle from "../Styles/Global.style"

import DefaultHeaderPage from "./DefaultHeaderPage"
import WelcomeFooter from "../PageComponents/WelcomeFooter"

const BasePage = ({
	className,
    children
}) => {
	return (
		<>
		    <GlobalStyle />
			<div className="page">
				<DefaultHeaderPage/>
				<div className={className}>
					{children}
					<WelcomeFooter/>
				</div>
			</div>
		</>
	)
}

export default BasePage
