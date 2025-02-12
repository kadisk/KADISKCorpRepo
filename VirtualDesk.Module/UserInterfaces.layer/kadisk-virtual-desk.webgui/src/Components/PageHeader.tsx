import * as React from "react"

const PageHeader = ({
    children
}) =>
    <div className="page-header d-print-none">
        <div className="container-xl">
            <div className="row g-2 align-items-center">
                {children}
            </div>
        </div>
    </div>

export default PageHeader