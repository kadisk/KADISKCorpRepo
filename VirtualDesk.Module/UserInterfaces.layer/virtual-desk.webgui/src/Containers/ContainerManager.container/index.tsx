import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import GetAPI from "../../Utils/GetAPI"
import ApplicationContainerPanel from "./ApplicationContainer.panel"

const CONTAINERS_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-box"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /></svg>
const IMAGES_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-stack-3"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l-8 4l8 4l8 -4l-8 -4" /><path d="M4 10l8 4l8 -4" /><path d="M4 18l8 4l8 -4" /><path d="M4 14l8 4l8 -4" /></svg>
const NETWORKS_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-network"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" /><path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" /><path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" /><path d="M6 9h12" /><path d="M3 20h7" /><path d="M14 20h7" /><path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 15v3" /></svg>

const CONTAINERS_MANAGER_MODE = Symbol()
const IMAGES_MANAGER_MODE = Symbol()
const NETWORKS_MANAGER_MODE = Symbol()

const ContainerManager = ({ HTTPServerManager }) => {

    const [containers, setContainers] = useState<any[]>([])
    const [images, setImages] = useState<any[]>([])
    const [networks, setNetworks] = useState<any[]>([])

    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<any>(CONTAINERS_MANAGER_MODE)

    useEffect(() => {
        if (mode === CONTAINERS_MANAGER_MODE) {
            fetchContainers()
        } else if (mode === IMAGES_MANAGER_MODE) {
            fetchImages()
        } else if (mode === NETWORKS_MANAGER_MODE) {
            fetchNetworks()
        }
    }, [mode])

    const getContainerManagerAPI = () =>
        GetAPI({
            apiName: "ContainerManager",
            serverManagerInformation: HTTPServerManager,
        })

    const fetchContainers = async () => {
        setLoading(true)
        setContainers([])
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

    const fetchImages = async () => {
        setLoading(true)
        setImages([])
        try {
            const api = getContainerManagerAPI()
            const response = await api.ListImages()
            setImages(response.data)
        } catch (error) {
            console.error("Error fetching images:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchNetworks = async () => {
        setLoading(true)
        setNetworks([])
        try {
            const api = getContainerManagerAPI()
            const response = await api.ListNetworks()
            setNetworks(response.data)
        } catch (error) {
            console.error("Error fetching networks:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveContainer = async (containerId: string) => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            await api.RemoveContainer({ containerIdOrName: containerId })
            fetchContainers()
        } catch (error) {
            console.error("Error removing container:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStopContainer = async (containerId: string) => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            await api.StopContainer({ containerIdOrName: containerId })
            fetchContainers()
        } catch (error) {
            console.error("Error stopping container:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStartContainer = async (containerId: string) => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            await api.StartContainer({ containerIdOrName: containerId })
            fetchContainers()
        } catch (error) {
            console.error("Error starting container:", error)
        } finally {
            setLoading(false)
        }
    }

    return <div className="pt-4">
        <div className="container-xl">
            {

                mode === CONTAINERS_MANAGER_MODE
                && (!containers || containers.length === 0)
                && !loading
                && <div className="text-center text-muted">
                    No containers found.
                </div>
            }

            {
                mode === IMAGES_MANAGER_MODE
                && (!images || images.length === 0)
                && !loading
                && <div className="text-center text-muted">
                    No images found.
                </div>
            }

            {
                mode === NETWORKS_MANAGER_MODE
                && (!networks || networks.length === 0)
                && !loading
                && <div className="text-center text-muted">
                    No networks found.
                </div>
            }

            {
                loading
                && <div className="text-center text-muted">
                    Loading containers...
                </div>
            }


            <div className="row">
                <div className="col-md-3">
                    <div className="navbar navbar-vertical navbar-expand-lg" style={{ "position": "relative", "width": "auto", "overflow": "auto" }}>
                        <div className="collapse navbar-collapse">

                            <ul className="navbar-nav pt-lg-3">
                                <li className={`nav-item cursor-pointer ${mode === CONTAINERS_MANAGER_MODE ? "active" : ""}`}>
                                    <a className="nav-link" onClick={() => setMode(CONTAINERS_MANAGER_MODE)}>
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            {CONTAINERS_ICON}
                                        </span>
                                        <span className="nav-link-title"> Containers </span>
                                    </a>
                                </li>
                                <li className={`nav-item cursor-pointer ${mode === IMAGES_MANAGER_MODE ? "active" : ""}`} >
                                    <a className="nav-link" onClick={() => setMode(IMAGES_MANAGER_MODE)}>
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            {IMAGES_ICON}
                                        </span>
                                        <span className="nav-link-title"> Images </span>
                                    </a>
                                </li>
                                <li className={`nav-item cursor-pointer ${mode === NETWORKS_MANAGER_MODE ? "active" : ""}`}>
                                    <a className="nav-link" onClick={() => setMode(NETWORKS_MANAGER_MODE)}>
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            {NETWORKS_ICON}
                                        </span>
                                        <span className="nav-link-title"> Networks </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    {
                        mode === CONTAINERS_MANAGER_MODE
                        && <div className="row row-cards">
                            {
                                containers.map((container) => <ApplicationContainerPanel
                                    container={container}
                                    onStartContainer={handleStartContainer}
                                    onStopContainer={handleStopContainer}
                                    onRemoveContainer={handleRemoveContainer} />)
                            }
                        </div>
                    }
                    {
                        mode === IMAGES_MANAGER_MODE &&
                        <div className="card">
                            <div className="table-responsive">
                                <table className="table table-vcenter table-mobile-md card-table" style={{ fontSize: "0.95em" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: 130, background: "#f6f8fa", fontWeight: 600, color: "#2c3e50" }}>Created</th>
                                            <th style={{ minWidth: 320, background: "#f6f8fa", fontWeight: 600, color: "#2c3e50" }}>Id</th>
                                            <th style={{ minWidth: 320, background: "#f6f8fa", fontWeight: 600, color: "#2c3e50" }}>RepoTags</th>
                                            <th style={{ minWidth: 90, background: "#f6f8fa", fontWeight: 600, color: "#2c3e50" }}>Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {images.map((image, idx) => (
                                            <React.Fragment key={image.Id || idx}>
                                                <tr style={idx % 2 === 0 ? { background: "#f9fafb" } : {}}>
                                                    <td data-label="Created" style={{ verticalAlign: "top", whiteSpace: "nowrap", fontWeight: 500, color: "#1976d2" }}>
                                                        {new Date(image.Created * 1000).toLocaleString()}
                                                    </td>
                                                    <td data-label="Id" style={{ verticalAlign: "top", fontFamily: "monospace", fontSize: "0.97em", color: "#444", wordBreak: "break-all" }}>
                                                        {image.Id}
                                                    </td>
                                                    <td data-label="RepoTags" style={{ verticalAlign: "top", wordBreak: "break-all" }}>
                                                        {Array.isArray(image.RepoTags) && image.RepoTags.length > 0
                                                            ? image.RepoTags.map((tag, i) => (
                                                                <div key={i} style={{ background: "#e3f2fd", borderRadius: 4, padding: "2px 6px", marginBottom: 2, display: "inline-block", color: "#1565c0" }}>{tag}</div>
                                                            ))
                                                            : <span className="text-muted">-</span>
                                                        }
                                                    </td>
                                                    <td data-label="Size" style={{ verticalAlign: "top", whiteSpace: "nowrap", fontWeight: 500 }}>
                                                        {image.Size >= 1024 * 1024 * 1024
                                                            ? `${(image.Size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                                                            : `${(image.Size / (1024 * 1024)).toFixed(2)} MB`
                                                        }
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                    {
                        mode === NETWORKS_MANAGER_MODE &&
                        <div className="row row-cards">
                            {networks.map((network, idx) => (
                                <div className="col-12" key={network.Id || idx}>
                                    <div className="card mb-3" style={{ boxShadow: "rgb(159, 166, 175) 0px 0px 5px 0px" }}>
                                        <div className="card-header bg-blue-lt py-2">
                                            <h5 style={{ color: "#1976d2", fontWeight: 600 }}>
                                                {network.Name}
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <dl className="row mb-0">
                                                <dt className="col-4">Id</dt>
                                                <dd className="col-8" style={{ fontFamily: "monospace", color: "#444", fontSize: "0.93em", wordBreak: "break-all" }}>
                                                    {network.Id}
                                                </dd>

                                                <dt className="col-4">Driver</dt>
                                                <dd className="col-8">{network.Driver}</dd>

                                                <dt className="col-4">Scope</dt>
                                                <dd className="col-8">{network.Scope}</dd>

                                                <dt className="col-4">Created</dt>
                                                <dd className="col-8">{new Date(network.Created).toLocaleString()}</dd>

                                                <dt className="col-4">IPAM</dt>
                                                <dd className="col-8">
                                                    {network.IPAM?.Driver && (
                                                        <span style={{
                                                            display: "inline-block",
                                                            borderRadius: 4,
                                                            padding: "2px 6px",
                                                            margin: "2px 4px 2px 0",
                                                            fontSize: "0.93em",
                                                            fontWeight: 600
                                                        }}>
                                                            Driver: {network.IPAM.Driver}
                                                        </span>
                                                    )}
                                                    {Array.isArray(network.IPAM?.Config) && network.IPAM.Config.length > 0 && network.IPAM.Config.map((cfg, i) => (
                                                        <React.Fragment key={i}>
                                                            {cfg.Subnet && (
                                                                <span style={{
                                                                    display: "inline-block",
                                                                    borderRadius: 4,
                                                                    padding: "2px 6px",
                                                                    margin: "2px 4px 2px 0",
                                                                    fontSize: "0.93em",
                                                                    fontWeight: 600
                                                                }}>
                                                                    Subnet: {cfg.Subnet}
                                                                </span>
                                                            )}
                                                            {cfg.Gateway && (
                                                                <span style={{
                                                                    display: "inline-block",
                                                                    borderRadius: 4,
                                                                    padding: "2px 6px",
                                                                    margin: "2px 4px 2px 0",
                                                                    fontSize: "0.93em",
                                                                    fontWeight: 600
                                                                }}>
                                                                    Gateway: {cfg.Gateway}
                                                                </span>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                    {(!network.IPAM?.Driver && (!network.IPAM?.Config || network.IPAM.Config.length === 0)) && (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </dd>

                                                <dt className="col-4">Flags</dt>
                                                <dd className="col-8">
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                        <span style={{
                                                            display: "inline-block",
                                                            background: network.EnableIPv4 ? "#e3f2fd" : "#eceff1",
                                                            color: network.EnableIPv4 ? "#1565c0" : "#78909c",
                                                            borderRadius: 4,
                                                            padding: "2px 8px",
                                                            fontWeight: 600,
                                                            fontSize: "0.93em"
                                                        }}>
                                                            IPv4: {network.EnableIPv4 ? "Yes" : "No"}
                                                        </span>
                                                        <span style={{
                                                            display: "inline-block",
                                                            background: network.EnableIPv6 ? "#e3f2fd" : "#eceff1",
                                                            color: network.EnableIPv6 ? "#1565c0" : "#78909c",
                                                            borderRadius: 4,
                                                            padding: "2px 8px",
                                                            fontWeight: 600,
                                                            fontSize: "0.93em"
                                                        }}>
                                                            IPv6: {network.EnableIPv6 ? "Yes" : "No"}
                                                        </span>
                                                        {network.Internal && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#fff3e0",
                                                                color: "#ef6c00",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>Internal</span>
                                                        )}
                                                        {network.Attachable && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#e3f2fd",
                                                                color: "#1565c0",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>Attachable</span>
                                                        )}
                                                        {network.Ingress && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#ede7f6",
                                                                color: "#4527a0",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>Ingress</span>
                                                        )}
                                                        {network.ConfigOnly && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#fce4ec",
                                                                color: "#ad1457",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>ConfigOnly</span>
                                                        )}
                                                        {network.ConfigFrom?.Network && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#f3e5f5",
                                                                color: "#6a1b9a",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>ConfigFrom: {network.ConfigFrom.Network}</span>
                                                        )}
                                                    </div>
                                                </dd>

                                                <dt className="col-4">Options</dt>
                                                <dd className="col-8">
                                                    {network.Options && Object.keys(network.Options).length > 0
                                                        ? Object.entries(network.Options).map(([k, v]) =>
                                                            <span key={k} style={{
                                                                display: "inline-block",
                                                                background: "#e3f2fd",
                                                                borderRadius: 4,
                                                                padding: "2px 6px",
                                                                margin: "2px 2px 2px 0",
                                                                color: "#1565c0",
                                                                fontSize: "0.93em"
                                                            }}>
                                                                {k}: {String(v)}
                                                            </span>
                                                        )
                                                        : <span className="text-muted">-</span>
                                                    }
                                                </dd>

                                                <dt className="col-4">Labels</dt>
                                                <dd className="col-8">
                                                    {network.Labels && Object.keys(network.Labels).length > 0
                                                        ? Object.entries(network.Labels).map(([k, v]) =>
                                                            <span key={k} style={{
                                                                display: "inline-block",
                                                                background: "#f3e5f5",
                                                                borderRadius: 4,
                                                                padding: "2px 6px",
                                                                margin: "2px 2px 2px 0",
                                                                color: "#6a1b9a",
                                                                fontSize: "0.93em"
                                                            }}>
                                                                {k}: {String(v)}
                                                            </span>
                                                        )
                                                        : <span className="text-muted">-</span>
                                                    }
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                   

                    
                </div>
            </div>

        </div>
    </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ContainerManager)