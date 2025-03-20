import * as React from "react"

import DefaultPage from "../Components/DefaultPage"
import MyServicesContainer from "../Containers/MyServices.container"

const MyServicesPage = () =>
    <DefaultPage>
        <div className="page-body">
            <MyServicesContainer/>
        </div>
    </DefaultPage>

export default MyServicesPage