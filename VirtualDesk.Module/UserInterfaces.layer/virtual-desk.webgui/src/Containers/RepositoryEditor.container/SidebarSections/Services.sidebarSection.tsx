import * as React from "react"
import { useState } from "react"

const iconCaretRight = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-caret-right"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 18l6 -6l-6 -6v12" />
    </svg>
)

const iconCaretDown = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-caret-down"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 10l6 6l6 -6h-12" />
    </svg>
)

const SETTINGS_AUTOMATION_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-settings-automation"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M10 9v6l5 -3z" /></svg>

const ServicesSidebarSection = ({
    servicesMetadata,
}) => {

    const [expanded, setExpanded] = useState(true)

    const toggleExpand = () => setExpanded(!expanded)


    return <div className="col-12 bg-green-lt">
        <div className="d-flex justify-content-start align-items-center p-1 bg-green text-green-fg">
            <span className="mb-0 d-flex align-items-center">
                SERVICES
            </span>
            <button className="btn btn-sm btn-link" onClick={() => toggleExpand()}>
                {expanded ? iconCaretDown : iconCaretRight}
            </button>
        </div>
        {
            servicesMetadata?.length > 0
                && expanded
                        && <div className="p-2">
                            <ul className="list-group">
                                {
                                    servicesMetadata
                                        .map(({ namespace, path }) => <li className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                <div className="d-inline-flex align-items-center">
                                                    {SETTINGS_AUTOMATION_ICON}
                                                </div>
                                                <div className="d-flex flex-column justify-content-center ms-2">
                                                    <strong>{namespace}</strong>
                                                    <span className="small text-break text-secondary">{path}</span>
                                                </div>
                                            </div>
                                        </li>)
                                }
                            </ul>
                        </div>
        }
    </div>
}

export default ServicesSidebarSection