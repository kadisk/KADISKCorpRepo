import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

import InstanceMonitoringContainer from "../../Containers/InstanceMonitoring.container"

const InstanceMonitoringPage = () => {
	return <DefaultPageWithTitle title="Instance Monitoring" preTitle="Ecosystem Monitoring">
				<InstanceMonitoringContainer />
			</DefaultPageWithTitle>
}

export default InstanceMonitoringPage
