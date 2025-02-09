import * as React from "react"

import BasePage from "./BasePage"

const FluidPage = ({
    children
}) => {
	return <BasePage className="page-wrapper layout-fluid">
				{children}
			</BasePage>
}

export default FluidPage