import * as React from "react"

type PageTitleProps = {
    title : string
    preTitle ?: string
}

const PageTitle = ({
    title,
    preTitle
}:PageTitleProps) =>
    <div className="page-header d-print-none">
        <div className="container-xl">
            <div className="row g-2 align-items-center">
                <div className="col">
                    <div className="page-pretitle">{preTitle}</div>
                    <h2 className="page-title">{title}</h2>
                </div>
            </div>
        </div>
    </div>

export default PageTitle