import * as React from "react"

import BasePage from "./BasePage"

const DefaultPage = ({
    children
}) => {
	return <BasePage className="page-wrapper">
				{children}
			</BasePage>
}

export default DefaultPage