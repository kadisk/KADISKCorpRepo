import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

import UserAdministrationContainer from "../../Containers/UserAdministration.container"

const UserAdministrationPage = () => 
	<DefaultPageWithTitle title="User Administration" preTitle="Ecosystem Manager">
		<UserAdministrationContainer />
	</DefaultPageWithTitle>

export default UserAdministrationPage
