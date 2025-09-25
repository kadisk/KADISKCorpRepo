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

const TERMINAL = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-terminal"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7l5 5l-5 5" /><path d="M12 19l7 0" /></svg>
const TERMINAL_2_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-terminal-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9l3 3l-3 3" /><path d="M13 15l3 0" /><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>

const CommandGroupSidebarSection = ({
    commandGroupMetadata,
}) => {

    const [expanded, setExpanded] = useState(true)

    const { commands } = commandGroupMetadata

    const toggleExpand = () => setExpanded(!expanded)

    return <div className="col-12 bg-yellow-lt">
        <div className="d-flex justify-content-start align-items-center p-1 bg-yellow text-yellow-fg">
            <span className="d-inline-flex align-items-center me-2">{TERMINAL_2_ICON}</span>
            <span className="mb-0 d-flex align-items-center">
                COMMAND GROUP
            </span>
            <button className="btn btn-sm btn-link" onClick={() => toggleExpand()}>
                {expanded ? iconCaretDown : iconCaretRight}
            </button>
        </div>
        {
            commands?.length > 0
                && expanded
                        && <div className="p-2">
                            <ul className="list-group">
                                {
                                    commands
                                        .map(({ namespace, path, command, description }) => <li className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                <div className="d-inline-flex align-items-center">
                                                    {TERMINAL}
                                                </div>
                                                <div className="d-flex flex-column justify-content-center ms-2">
                                                    <strong>{command}</strong>
                                                    <span className="small text-break text-secondary">{description}</span>
                                                </div>
                                            </div>
                                        </li>)
                                }
                            </ul>
                        </div>
        }
    </div>
}

export default CommandGroupSidebarSection