import * as React from "react"

import DefaultPage from "../Components/DefaultPage"
import PageTitle from "./PageTitle"

type DefaultPageWithTitleProps = {
	title : string
	preTitle ?: string
	children : any
}

const DefaultPageWithTitle = ({
    title,
    preTitle,
    children
}:DefaultPageWithTitleProps) => {
	return <DefaultPage>
				<PageTitle title={title} preTitle={preTitle}/>
                <div className="page-body">{children}</div>
			</DefaultPage>
}

export default DefaultPageWithTitle
