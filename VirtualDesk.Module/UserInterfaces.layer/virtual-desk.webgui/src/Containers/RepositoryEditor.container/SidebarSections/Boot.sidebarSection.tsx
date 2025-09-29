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

const PLAYER_PLAY_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
const ICON_TERMINAL_2 = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-terminal-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9l3 3l-3 3" /><path d="M13 15l3 0" /><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>
const SETTINGS_AUTOMATION_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-settings-automation"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M10 9v6l5 -3z" /></svg>
const WORLD_CODE_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-code"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.942 13.02a9 9 0 1 0 -9.47 7.964" /><path d="M3.6 9h16.8" /><path d="M3.6 15h9.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3c2 3.206 2.837 6.913 2.508 10.537" /><path d="M20 21l2 -2l-2 -2" /><path d="M17 17l-2 2l2 2" /></svg>

const BootSidebarSection = ({
    bootMetadata,
}) => {

    const [expanded, setExpanded] = useState(true)

    const toggleExpand = () => setExpanded(!expanded)


    return <div className="col-12 bg-orange-lt">
        <div className="d-flex justify-content-start align-items-center p-1 bg-orange text-orange-fg">
            <span className="mb-0 d-flex align-items-center">
                <span className="d-inline-flex align-items-center me-2">{PLAYER_PLAY_ICON}</span>
                BOOT
            </span>
            <button className="btn btn-sm btn-link" onClick={() => toggleExpand()}>
                {expanded ? iconCaretDown : iconCaretRight}
            </button>
        </div>
        {
            bootMetadata
                && expanded
                        && <div className="p-2">
                            <ul className="list-group">
                                {
                                    bootMetadata?.executables 
                                    && bootMetadata.executables.length > 0
                                    && <li className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                <div className="d-flex flex-column justify-content-center ms-2">
                                                    <strong>Executables</strong>
                                                </div>
                                            </div>
                                            <div className="ms-2 mt-1 border-start ps-3">
                                                <ul className="list-group">
                                                    {
                                                        bootMetadata?.executables
                                                        .map(({
                                                            executableName,
                                                            dependency
                                                        }) => {
                                                            return <li className="list-group-item border-0 p-0 cursor-pointer">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="d-inline-flex align-items-center">
                                                                        {ICON_TERMINAL_2}
                                                                    </div>
                                                                    <div className="d-flex flex-column justify-content-center ms-2">
                                                                        <strong>{executableName}</strong>
                                                                        <span className="small text-break text-secondary">{dependency}</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </li>
                                }
                                {
                                    bootMetadata?.services 
                                    && bootMetadata.services.length > 0
                                    && <li className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                <div className="d-flex flex-column justify-content-center ms-2">
                                                    <strong>Services</strong>
                                                </div>
                                            </div>
                                            <div className="ms-2 mt-1 border-start ps-3">
                                                <ul className="list-group">
                                                    {
                                                        bootMetadata?.services
                                                        .map(({
                                                            namespace,
                                                            dependency
                                                        }) => {
                                                            return <li className="list-group-item border-0 p-0 cursor-pointer">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="d-inline-flex align-items-center">
                                                                        {SETTINGS_AUTOMATION_ICON}
                                                                    </div>
                                                                    <div className="d-flex flex-column justify-content-center ms-2">
                                                                        <strong>{namespace}</strong>
                                                                        <span className="small text-break text-secondary">{dependency}</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </li>
                                }
                                {
                                    bootMetadata?.endpoints 
                                    && bootMetadata.endpoints.length > 0
                                    && <li className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                <div className="d-flex flex-column justify-content-center ms-2">
                                                    <strong>Endpoints</strong>
                                                </div>
                                            </div>
                                            <div className="ms-2 mt-1 border-start ps-3">
                                                <ul className="list-group">
                                                    {
                                                        bootMetadata?.endpoints
                                                        .map(({
                                                            dependency
                                                        }) => {
                                                            return <li className="list-group-item border-0 p-0 cursor-pointer">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="d-inline-flex align-items-center">
                                                                        {WORLD_CODE_ICON}
                                                                    </div>
                                                                    <div className="d-flex flex-column justify-content-center ms-2">
                                                                        <strong>{dependency}</strong>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </li>
                                }
                            </ul>
                        </div>
        }
    </div>
}

export default BootSidebarSection