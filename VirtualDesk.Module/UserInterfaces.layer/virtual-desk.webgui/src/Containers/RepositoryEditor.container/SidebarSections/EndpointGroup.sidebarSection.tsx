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

const WORLD_CODE_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-code"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.942 13.02a9 9 0 1 0 -9.47 7.964" /><path d="M3.6 9h16.8" /><path d="M3.6 15h9.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3c2 3.206 2.837 6.913 2.508 10.537" /><path d="M20 21l2 -2l-2 -2" /><path d="M17 17l-2 2l2 2" /></svg>
const NETWORK_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-network"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" /><path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" /><path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" /><path d="M6 9h12" /><path d="M3 20h7" /><path d="M14 20h7" /><path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 15v3" /></svg>

const EndpointGroupSidebarSection = ({
    endpointGroupMetadata,
}) => {

    const [expanded, setExpanded] = useState(true)

    const toggleExpand = () => setExpanded(!expanded)

    const { endpoints } = endpointGroupMetadata


    return <div className="col-12 bg-teal-lt">
        <div className="d-flex justify-content-start align-items-center p-1 bg-teal text-teal-fg">
            <span className="mb-0 d-flex align-items-center">
                <span className="d-inline-flex align-items-center me-2">{WORLD_CODE_ICON}</span>
                ENDPOINT GROUP
            </span>
            <button className="btn btn-sm btn-link" onClick={() => toggleExpand()}>
                {expanded ? iconCaretDown : iconCaretRight}
            </button>
        </div>
        {
            endpoints?.length > 0
                && expanded
                        && <div className="p-2">
                            <ul className="list-group">
                                {
                                    endpoints
                                        .map(({ url, type }) => <li key={`${type}-${url}`} className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                <div className="d-inline-flex align-items-center">
                                                    {NETWORK_ICON}
                                                </div>
                                                <div className="d-flex flex-column justify-content-center ms-2">
                                                    <strong className="small text-break">{url}</strong>
                                                    <span className="text-secondary">{type}</span>
                                                </div>
                                            </div>
                                        </li>)
                                }
                            </ul>
                        </div>
        }
    </div>
}

export default EndpointGroupSidebarSection