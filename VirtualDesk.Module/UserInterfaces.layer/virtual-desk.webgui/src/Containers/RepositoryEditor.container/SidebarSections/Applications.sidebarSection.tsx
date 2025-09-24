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

const iconApps = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-apps"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 7l6 0" /><path d="M17 4l0 6" /></svg>
const iconAppWindow = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-app-window"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M6 8h.01" /><path d="M9 8h.01" /></svg>
const iconTerminal2 = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-terminal-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9l3 3l-3 3" /><path d="M13 15l3 0" /><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>


const ApplicationsSidebarSection = ({
    applicationsMetadata,
}) => {

    const [expanded, setExpanded] = useState(true)

    const toggleExpand = () => setExpanded(!expanded)


    return <div className="col-12 border-bottom bg-dark-lt">
        <div className="d-flex justify-content-start align-items-center p-1 bg-dark text-dark-fg">
            <strong className="mb-0 d-flex align-items-center">
                <span className="d-inline-flex align-items-center me-2">{iconApps}</span>
                Applications
            </strong>
            <button className="btn btn-sm btn-link" onClick={() => toggleExpand()}>
                {expanded ? iconCaretDown : iconCaretRight}
            </button>
        </div>
        {
            applicationsMetadata?.length > 0
                ? expanded
                        && <div className="ms-2 mt-1 border-start ps-3">
                            <ul className="list-group">
                                {
                                    applicationsMetadata
                                        .map(({ executable, appType }) => <li className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                <span>
                                                    {appType === "APP" ? iconAppWindow : ""}
                                                    {appType === "CLI" ? iconTerminal2 : ""}
                                                    {executable} <span className="text-secondary">{appType}</span>
                                                </span>

                                            </div>
                                        </li>)
                                }
                            </ul>
                        </div>
                        
                : <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
        }
    </div>
}

export default ApplicationsSidebarSection