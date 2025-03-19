import * as React from "react"

import DefaultPage from "../Components/DefaultPage"

const MyAppsPage = () =>
    <DefaultPage>
        <div className="page-body d-flex flex-column justify-content-center align-items-center text-center py-5">
            <div className="container-xl">
                <div className="empty">
                    <h1 className="empty-title">Your execution environment has not been configured yet</h1>
                    <p className="empty-subtitle text-secondary">
                        to manage your apps, you need to configure the execution environment
                    </p>
                    <div className="empty-action d-flex gap-3">
                        <button className="btn btn-cyan">
							<svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6 4v4" /><path d="M6 12v8" /><path d="M13.199 14.399a2 2 0 1 0 -1.199 3.601" /><path d="M12 4v10" /><path d="M12 18v2" /><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M18 4v1" /><path d="M18 9v2.5" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>
                            configure your execution environment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DefaultPage>

export default MyAppsPage