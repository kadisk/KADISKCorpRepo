import * as React from "react"

import FluidPage from "../Components/FluidPage"
import PageTitle from "./PageTitle"

type FluidPageWithTitleProps = {
	title : string
	preTitle ?: string
	children : any
}

const FluidPageWithTitle = ({
    title,
    preTitle,
    children
}:FluidPageWithTitleProps) => {
	return <FluidPage>
				<PageTitle title={title} preTitle={preTitle}/>
                <div className="page-body">{children}</div>
			</FluidPage>
}

export default FluidPageWithTitle
