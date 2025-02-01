import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

import EventHistoryContainer from "../../Containers/EventHistory.container"

const EventHistoryPage = () => {
	return <DefaultPageWithTitle title="Event History" preTitle="Ecosystem Monitoring">
				<EventHistoryContainer/>
			</DefaultPageWithTitle>
}


export default EventHistoryPage
