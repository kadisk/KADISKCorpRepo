import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import GetAPI from "../Utils/GetAPI"

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

const ApplicationContainerPanel = ({ container, onRemoveContainer }) => {

    console.log(container)
    
    const badgeClasses = GetSatatusBadgeClasses(container.State.Status)

    return (
        <div className="col-12">
            <div className="card mb-3" style={{ "boxShadow": "rgb(159, 166, 175) 0px 0px 5px 0px"}}>
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs flex-row-reverse bg-blue-lt">
                        <li className="nav-item">
                            <a href="#tabs-home-2" className="nav-link active">General</a>
                        </li>
                        <li className="nav-item">
                            <a href="#tabs-profile-2" className="nav-link">Networks</a>
                        </li>
                        <li className="nav-item">
                            <a href="#tabs-profile-2" className="nav-link">Volumes</a>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    <h5><span className={badgeClasses}>{container.State.Status}</span> {container.Name}</h5>
                    <hr className="hr mt-1 mb-3" />
                    <div className="card bg-dark-lt">
                        <div className="card-header py-2">
                            <strong>environment variables</strong>
                        </div>
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
                </div>
                <div className="card-footer bg-blue-lt">
                    <div className="btn-list justify-content-end">
                        {
                            container.State.Status === "exited"
                            && <button className="btn btn-primary">
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
                            && <button className="btn btn-orange">
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

const ContainerManager = ({ HTTPServerManager }) => {

    const [containers, setContainers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchContainers()
    }, [])

    const getContainerManagerAPI = () =>
        GetAPI({
            apiName: "ContainerManager",
            serverManagerInformation: HTTPServerManager,
        })

    const fetchContainers = async () => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            const response = await api.ListContainers()
            setContainers(response.data)
        } catch (error) {
            console.error("Error fetching containers:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveContainer = async (containerId: string) => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            await api.RemoveContainer({ containerIdOrName:containerId })
            fetchContainers()
        } catch (error) {
            console.error("Error removing container:", error)
        } finally {
            setLoading(false)
        }
    }

    return <div className="pt-4">
                <div className="container-xl">
                    {
                        (!containers || containers.length === 0)
                        && !loading
                        && <div className="text-center text-muted">
                            No containers found.
                        </div>
                    }

                    {
                        loading
                        && containers.length === 0
                        && <div className="text-center text-muted">
                            Loading containers...
                        </div>
                    }

                    <div className="row row-cards">
                        {containers.map((container) => <ApplicationContainerPanel onRemoveContainer={handleRemoveContainer} container={container}/>)}
                    </div>
                </div>
            </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ContainerManager)