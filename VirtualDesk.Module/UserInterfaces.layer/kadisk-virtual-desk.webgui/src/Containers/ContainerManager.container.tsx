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

const ApplicationContainerPanel = ({container}) => {

    console.log(container)
    
    const badgeClasses = GetSatatusBadgeClasses(container.State.Status)

    return (
        <div className="col-12">
            <div className="card">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs flex-row-reverse">
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
                    <h5>{container.Name} <span className={badgeClasses}>{container.State.Status}</span></h5>
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
                <div className="card-footer">
                    <div className="btn-list justify-content-end">
                        {
                            container.State.Status === "exited"
                            && <a href="#" className="btn btn-primary">start</a>
                        }
                        {/*<a href="#" className="btn btn-yellow">unpause</a>*/}
                        {
                            container.State.Status === "running"
                            && <a href="#" className="btn btn-yellow">pause</a>
                        }
                        {
                            container.State.Status === "running"
                            && <a href="#" className="btn btn-orange">restart</a>
                        }
                        {
                            container.State.Status === "running"
                            && <a href="#" className="btn btn-danger">stop</a>
                        }
                        {
                            container.State.Status === "running"
                            && <a href="#" className="btn btn-danger">kill</a>
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

    
    return <div className="container-xl mt-4">
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
                    {containers.map((container) => <ApplicationContainerPanel container={container}/>)}
                </div>
            </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ContainerManager)