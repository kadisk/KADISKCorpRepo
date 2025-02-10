import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

import MyWorkspaceContainer from "../../Containers/MyWorkspace.container"

const MyWorkspaces = () => {
	return <DefaultPageWithTitle title="My Workspaces" preTitle="Workbench">
		<MyWorkspaceContainer />
	</DefaultPageWithTitle>
}

export default MyWorkspaces
