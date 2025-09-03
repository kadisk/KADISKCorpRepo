import * as React from "react"

const WelcomeWorkspace = ({
    onSelectCreateRepository,
    onSelectImportRepository
}) => {
    return <div className="container-xl d-flex flex-column justify-content-center align-items-center text-center py-5">
                <div className="empty">
                    <h1 className="empty-title">No repository found</h1>
                    <p className="empty-subtitle text-secondary">
                        To get started, you can create a new repository or import an existing one.
                    </p>
                    <div className="empty-action d-flex gap-3">
                        <button className="btn btn-primary" onClick={() => onSelectCreateRepository()}>
                            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                            Create new repository
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => onSelectImportRepository()}>
                            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
                            Import existing repository
                        </button>
                    </div>
                </div>
            </div>
}


export default WelcomeWorkspace