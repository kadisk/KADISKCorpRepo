import * as React from "react"

import PageHeader from "./PageHeader"

type PageTitleProps = {
    title : string
    preTitle ?: string
}

const PageTitle = ({
    title,
    preTitle
}:PageTitleProps) =>
    <PageHeader>
         <div className="col">
            <div className="page-pretitle">{preTitle}</div>
            <h2 className="page-title">{title}</h2>
        </div>
    </PageHeader>

export default PageTitle