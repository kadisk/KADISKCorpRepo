import * as React from "react"

import DefaultPage from "../Components/DefaultPage"
import MyServicesContainer from "../Containers/MyServices.container"

const MyServicesPage = () =>
    <DefaultPage>
        <div className="page-body d-flex flex-column justify-content-center align-items-center text-center py-5">
            <MyServicesContainer/>
        </div>
    </DefaultPage>

export default MyServicesPage