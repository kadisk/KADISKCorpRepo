import * as React from "react"

import DefaultPage from "../Componentes/DefaultPage"

const PageTitle = ({
	title,
	preTitle
}) =>
	<div className="page-header d-print-none">
		<div className="container-xl">
			<div className="row g-2 align-items-center">
				<div className="col">
					<div className="page-pretitle">{preTitle}</div>
					<h2 className="page-title">{title}</h2>
				</div>
			</div>
		</div>
	</div>

const DefaultPageWithTitle = ({
    title,
    preTitle,
    children
}) => {
	return <DefaultPage>
				<PageTitle title={title} preTitle={preTitle}/>
                <div className="page-body">{children}</div>
			</DefaultPage>
}

export default DefaultPageWithTitle
