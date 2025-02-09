import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"
import RepositorySettingsContainer from "../../Containers/RepositorySettings.container"

const RepositorySettingsPage = () => {

	return <DefaultPageWithTitle title="Repository Settings" preTitle="Ecosystem Administrator">
		<RepositorySettingsContainer/>
	</DefaultPageWithTitle>
}

export default RepositorySettingsPage
