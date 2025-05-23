import React, { useState } from "react"

const GetSatatusBadgeClasses = (status: string) => {
    switch (status) {
        case "running":
            return "badge bg-green-lt text-green"
        case "exited":
            return "badge bg-red-lt text-red"
        default:
            return "badge bg-orange-lt text-orange"
    }
}


const TABS_LIST = [
    { label: "General information", code: "general" },
    { label: "Networks", code: "networks" },
    { label: "Environment variables", code: "environment-variables" },
]


const ApplicationContainerPanel = ({ container, onRemoveContainer, onStopContainer, onStartContainer}) => {

    const [ tabCodeSelected, setTabCodeSelected ] = useState("general")
    
    const badgeClasses = GetSatatusBadgeClasses(container.State.Status)

    return (
        <div className="col-12">
            <div className="card mb-3" style={{ "boxShadow": "rgb(159, 166, 175) 0px 0px 5px 0px"}}>
                <div className="card-header bg-blue-lt py-2">
                    <h5><span className={badgeClasses}>{container.State.Status}</span> {container.Name}</h5>
                </div>
                <div className="card-header bg-blue-lt">
                    <ul className="nav nav-tabs card-header-tabs flex-row-reverse">
                        {
                            TABS_LIST
                            .map((tab) =>   
                                <li className="nav-item">
                                    <a className={`nav-link cursor-pointer ${tabCodeSelected === tab.code ? "active" : ""}`} onClick={() => setTabCodeSelected(tab.code)}>{tab.label}</a>
                                </li>
                            )
                        }
                        <li className="nav-item me-auto">
                        </li>
                    </ul>
                </div>
                {
                    tabCodeSelected === "general"
                    && <div className="card-body">
                            <dl className="row">
                                <dt className="col-5">Image</dt>
                                <dd className="col-7">{container.Config.Image}</dd>
                                <dt className="col-5">Cmd</dt>
                                <dd className="col-7">{container.Config.Cmd.join(" ")}</dd>
                                <dt className="col-5">Hostname</dt>
                                <dd className="col-7">{container.Config.Hostname}</dd>
                                <dt className="col-5">User</dt>
                                <dd className="col-7">{container.Config.User}</dd>
                            </dl>
                        </div>
                }
                {
                    tabCodeSelected === "networks"
                    && <div className="card-body">
                            <dl className="row">
                                <dt className="col-5">IPAddress</dt>
                                <dd className="col-7">{container.NetworkSettings.IPAddress}</dd>
                                <dt className="col-5">Gateway</dt>
                                <dd className="col-7">{container.NetworkSettings.Gateway}</dd>
                                <dt className="col-5">MacAddress</dt>
                                <dd className="col-7">{container.NetworkSettings.MacAddress}</dd>
                            </dl>
                        </div>
                }
                {
                    tabCodeSelected === "environment-variables"
                    && <div className="card-body">
                            <div className="card-body p-1">
                                <div className="align-items-center">
                                    <div className="list-group list-group-flush list-group-hoverable">
                                        {
                                            container.Config.Env
                                            .map((env: string) => 
                                            <div className="list-group-item py-2">
                                                <div className="align-items-center">
                                                    <div className="col text-truncate">{env}</div>
                                                </div>
                                            </div>)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                }
                <div className="card-footer bg-blue-lt">
                    <div className="btn-list justify-content-end">
                        {
                            container.State.Status === "exited"
                            && <button className="btn btn-primary" onClick={() => onStartContainer(container.Id)}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>start
                            </button>
                        }
                        {
                            container.State.Status === "exited"
                            && <button className="btn btn-danger" onClick={() => onRemoveContainer(container.Id)}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>delete
                            </button>
                        }
                        {
                            container.State.Status === "running"
                            && <button className="btn btn-yellow">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>pause
                            </button>
                        }
                        {
                            container.State.Status === "running"
                            && <button className="btn btn-orange">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>restart
                            </button>
                        }
                        {
                            container.State.Status === "running"
                            && <button className="btn btn-orange" onClick={() => onStopContainer(container.Id)}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>stop
                            </button>
                        }
                        {
                            container.State.Status === "running"
                            && <button className="btn btn-danger">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-cancel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M18.364 5.636l-12.728 12.728" /></svg>kill
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationContainerPanel