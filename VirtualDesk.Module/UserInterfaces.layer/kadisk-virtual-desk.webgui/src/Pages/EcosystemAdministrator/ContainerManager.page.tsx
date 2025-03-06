import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

import ContainerManagerContainer from "../../Containers/ContainerManager.container"

const ContainerManagerPage = () => {

	return (
		<DefaultPageWithTitle title="Container Manager" preTitle="Ecosystem Administrator">
			<ContainerManagerContainer />
		</DefaultPageWithTitle>
	)
}

export default ContainerManagerPage
