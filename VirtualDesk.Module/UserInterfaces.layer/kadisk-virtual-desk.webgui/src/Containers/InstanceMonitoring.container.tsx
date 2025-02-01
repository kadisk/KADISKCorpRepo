import * as React from "react"

const InstanceMonitoringContainer = () => {
    return <div className="container-xl">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Last updates</h3>
                        </div>
                        <div className="list-group list-group-flush list-group-hoverable">
                            <div className="list-group-item">
                                <div className="row align-items-center">
                                    <div className="col-auto"><span className="status-dot status-dot-animated bg-red d-block"></span></div>
                                    <div className="col text-truncate">
                                        <a href="#" className="text-body d-block">Example 1</a>
                                        <div className="d-block text-secondary text-truncate mt-n1">
                                            Change deprecated html tags to text decoration classes (#29604)
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <a href="#" className="list-group-item-actions">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="row align-items-center">
                                    <div className="col-auto"><span className="status-dot d-block"></span></div>
                                    <div className="col text-truncate">
                                        <a href="#" className="text-body d-block">Example 2</a>
                                        <div className="d-block text-secondary text-truncate mt-n1">
                                            justify-content:between ⇒ justify-content:space-between (#29734)
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <a href="#" className="list-group-item-actions show">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-yellow" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="row align-items-center">
                                    <div className="col-auto"><span className="status-dot d-block"></span></div>
                                    <div className="col text-truncate">
                                        <a href="#" className="text-body d-block">Example 3</a>
                                        <div className="d-block text-secondary text-truncate mt-n1">
                                            Update change-version.js (#29736)
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <a href="#" className="list-group-item-actions">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="row align-items-center">
                                    <div className="col-auto"><span className="status-dot status-dot-animated bg-green d-block"></span></div>
                                    <div className="col text-truncate">
                                        <a href="#" className="text-body d-block">Example 4</a>
                                        <div className="d-block text-secondary text-truncate mt-n1">
                                            Regenerate package-lock.json (#29730)
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <a href="#" className="list-group-item-actions">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
}

export default InstanceMonitoringContainer
