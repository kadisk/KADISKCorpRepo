import * as React from "react"

const WelcomeMyServices = ({
    onImportNew,
    onUseFromMyWorkspace
}) => 
    <div className="container-xl">
        <div className="empty">
            <h1 className="empty-title">None repository configured!</h1>
            <p className="empty-subtitle text-secondary">
                To start a new service, you need to have a Meta Platform standard repository configured
            </p>
            <div className="empty-action d-flex gap-3">
                <button className="btn btn-cyan" onClick={onImportNew}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
                    Import and configure a new repository
                </button>
                <button className="btn btn-outline-cyan" onClick={onUseFromMyWorkspace}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-test-pipe"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 8.04l-12.122 12.124a2.857 2.857 0 1 1 -4.041 -4.04l12.122 -12.124" /><path d="M7 13h8" /><path d="M19 15l1.5 1.6a2 2 0 1 1 -3 0l1.5 -1.6z" /><path d="M15 3l6 6" /></svg>
                    Use a repository from&nbsp;<strong>My Workspaces</strong>
                </button>
            </div>
        </div>
    </div>

export default WelcomeMyServices