import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import LogStreamingModal from "./LogStreaming.modal"

const InstanceMonitoringContainer = ({ HTTPServerManager }) => {

    const [ instanceOverview, setInstanceOverview ] = useState<any[]>()

    const [ socketFileIdLogStreaming, setSocketFileIdLogStreaming ] = useState()

    useEffect(() => {
        fetchInstanceOverview()
    }, [])

    const _GetInstanceMonitoringAPI = () =>
        GetAPI({
            apiName: "InstanceMonitoring",
            serverManagerInformation: HTTPServerManager
        })

    const fetchInstanceOverview = async () => {
        const api = _GetInstanceMonitoringAPI()
        const response = await api.GetInstancesOverview()
        setInstanceOverview(response.data)
    }

    const handleOpenModalLogStreaming = (socketFileId) => {
        setSocketFileIdLogStreaming(socketFileId)
    }

    const handleCloseModalLogStreaming = () => {
        setSocketFileIdLogStreaming(undefined)
    }


    return <div className="container-xl">
                

                {
                    socketFileIdLogStreaming
                    && <LogStreamingModal 
                    socketFileId={socketFileIdLogStreaming}
                    onClose={() => handleCloseModalLogStreaming}/>
                }
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Monitored Instances</h3>
                        </div>
                        <div className="list-group list-group-flush list-group-hoverable">
                            {

                                instanceOverview
                                && instanceOverview
                                .map(({ socketFilePath, status, createdAt, socketFileId}) => {
                                    return <div className="list-group-item">
                                                <div className="row align-items-center">
                                                    <div className="col-auto"><span className="badge bg-green text-green-fg">{status}</span></div>
                                                    <div className="col text-truncate">
                                                        <a href={`#instance-monitor?socketFileId=${socketFileId}`} className="text-body d-block">{socketFilePath}</a>
                                                        <div className="d-block text-secondary text-truncate mt-n1">
                                                            {createdAt}
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <button className="btn btn-outline-secondary" onClick={() => handleOpenModalLogStreaming(socketFileId)}>
                                                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-logs"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12h.01" /><path d="M4 6h.01" /><path d="M4 18h.01" /><path d="M8 18h2" /><path d="M8 12h2" /><path d="M8 6h2" /><path d="M14 6h6" /><path d="M14 12h6" /><path d="M14 18h6" /></svg>
                                                            Log Streaming</button>
                                                    </div>
                                                </div>
                                            </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(InstanceMonitoringContainer)