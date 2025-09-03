import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"
import MyEcosystemConsoleContainer from "../../Containers/MyEcosystemConsole.container"

const MyEcosystemConsolePage = () => {
	return <DefaultPageWithTitle title="My Ecosystem Console" preTitle="Workbench">
				<MyEcosystemConsoleContainer/>
			</DefaultPageWithTitle>
}

export default MyEcosystemConsolePage
