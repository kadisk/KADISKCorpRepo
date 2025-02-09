import * as React from "react"

import WelcomeHeader from "../PageComponents/WelcomeHeader"
import WelcomeMenu from "../PageComponents/WelcomeMenu"

const DefaultHeaderPage = () => {
	return <div className="sticky-top">
                <WelcomeHeader/>
                <WelcomeMenu/>
            </div>
}

export default DefaultHeaderPage
