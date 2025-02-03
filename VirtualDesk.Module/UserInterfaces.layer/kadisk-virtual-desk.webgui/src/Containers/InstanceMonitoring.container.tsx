import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

const InstanceMonitoringContainer = ({ HTTPServerManager }) => {

    const [ instanceOverview, setInstanceOverview ] = useState<any[]>()

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

    return <div className="container-xl">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Monitored Instances</h3>
                        </div>
                        <div className="list-group list-group-flush list-group-hoverable">
                            {

                                instanceOverview
                                && instanceOverview
                                .map(({ socketFilePath, status, createdAt }) => {
                                    return <div className="list-group-item">
                                                <div className="row align-items-center">
                                                    <div className="col-auto"><span className="badge bg-green text-green-fg">{status}</span></div>
                                                    <div className="col text-truncate">
                                                        <a href="#" className="text-body d-block">{socketFilePath}</a>
                                                        <div className="d-block text-secondary text-truncate mt-n1">
                                                            {createdAt}
                                                        </div>
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