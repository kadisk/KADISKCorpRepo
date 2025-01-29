import * as React from "react"

import DefaultParametersContainer from "../../Containers/DefaultParameters.container"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

const DefaultParametersPage = () => {
	return <DefaultPageWithTitle title="Default Parameters" preTitle="Ecosystem Settings">
				<DefaultParametersContainer />
			</DefaultPageWithTitle>
}

export default DefaultParametersPage
