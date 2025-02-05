import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"
import HTTPServerManagerInformationContainer from "../../Containers/HTTPServerManagerInformation.container"

const HTTPServerManagerInformationPage = () => {
	return <DefaultPageWithTitle title="HTTP Server Manager Information" preTitle="Ecosystem Monitoring">
				<HTTPServerManagerInformationContainer/>
			</DefaultPageWithTitle>
}


export default HTTPServerManagerInformationPage
