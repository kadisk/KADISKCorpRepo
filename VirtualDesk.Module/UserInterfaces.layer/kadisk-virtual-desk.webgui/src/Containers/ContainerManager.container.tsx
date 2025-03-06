import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import GetAPI from "../Utils/GetAPI"

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

    const getStateBadgeClasses = (state: string) => {
        switch (state) {
            case "running":
                return "badge bg-green-lt text-green"
            case "exited":
                return "badge bg-red-lt text-red"
            default:
                return "badge bg-orange-lt text-orange"
        }
    }

    return (
        <div className="container-xl mt-4">
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
                {containers.map((container) => {
                    // Extract IP from the first network
                    const networks = container.NetworkSettings?.Networks
                    let ipAddress = ""
                    if (networks) {
                        const networkKeys = Object.keys(networks)
                        if (networkKeys.length > 0) {
                            ipAddress = networks[networkKeys[0]].IPAddress || ""
                        }
                    }

                    const createdDate = new Date(container.Created * 1000).toLocaleString()

                    const badgeClasses = getStateBadgeClasses(container.State)

                    const ports =
                        container.Ports?.map((p) =>
                            p.PublicPort ? p.PublicPort : p.PrivatePort
                        ).join(", ") || "-"

                    return (
                        <div className="col-12" key={container.Id}>
                            <div className="card card-md">
                                <div className="card-body p-4">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <div className="d-block font-weight-medium">
                                                {container.Names?.join(", ")}
                                            </div>
                                            <div className="text-muted">
                                                {container.Id}
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <span className={badgeClasses}>{container.State}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 row">
                                        <div className="col-12 col-md-6 mb-2">
                                            <strong>Image:</strong> {container.Image}
                                        </div>
                                        <div className="col-12 col-md-6 mb-2">
                                            <strong>Command:</strong> {container.Command}
                                        </div>
                                        <div className="col-12 col-md-6 mb-2">
                                            <strong>Ports:</strong> {ports}
                                        </div>
                                        <div className="col-12 col-md-6 mb-2">
                                            <strong>IP:</strong> {ipAddress || "-"}
                                        </div>
                                        <div className="col-12 col-md-6 mb-2">
                                            <strong>Status:</strong> {container.Status}
                                        </div>
                                        <div className="col-12 col-md-6 mb-2">
                                            <strong>Created:</strong> {createdDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ContainerManager)
