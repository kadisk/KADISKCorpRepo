import * as React from "react"

import DefaultPage from "../../Components/DefaultPage"
import PageTitle from "../../Components/PageTitle"

import ContainerManagerContainer from "../../Containers/ContainerManager.container"

const ContainerManagerPage = () => 
	<DefaultPage>
		<PageTitle title="Container Manager" preTitle="Ecosystem Administrator"/>
		<div className="page-body mt-1"><ContainerManagerContainer/></div>
	</DefaultPage>


export default ContainerManagerPage
