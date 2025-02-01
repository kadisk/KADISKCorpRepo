import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

import NotificationHistoryContainer from "../../Containers/NotificationHistory.container"

const NotificationHistoryPage = () => {
	return <DefaultPageWithTitle title="Notification History" preTitle="Ecosystem Monitoring">
				<NotificationHistoryContainer/>
			</DefaultPageWithTitle>
}


export default NotificationHistoryPage
