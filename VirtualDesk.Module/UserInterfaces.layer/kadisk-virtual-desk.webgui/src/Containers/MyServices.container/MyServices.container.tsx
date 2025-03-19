import * as React from "react"

import WelcomeMyServices from "./WelcomeMyServices"

const MyServicesContainer = () => {


    const handleImportNew = () => {
        console.log("=== handleImportNew")
    }

    const handleUseFromMyWorkspace = () => {
        console.log("== handleUseFromMyWorkspace")
    }

    return <div className="page-body d-flex flex-column justify-content-center align-items-center text-center py-5">
                <WelcomeMyServices onImportNew={handleImportNew} onUseFromMyWorkspace={handleUseFromMyWorkspace}/>
            </div>
}
    

export default MyServicesContainer