import * as React from "react"

//@ts-ignore
import logoVirtualDesk2 from "../../Assets/logo-virtual-desk2.svg"

const WelcomeHeader = () => {
    return <header className="navbar navbar-expand-md sticky-top d-print-none">
        <div className="container-xl">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                <a href=".">
                    <img src={logoVirtualDesk2} width={200} />
                </a>
            </div>
        </div>
    </header>
}

export default WelcomeHeader
