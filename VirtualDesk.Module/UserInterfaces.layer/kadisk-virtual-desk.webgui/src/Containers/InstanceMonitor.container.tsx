import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

const InstanceMonitorContainer = ({ HTTPServerManager, socketFileId }) => {

    const [ instanceMonitorData, setInstanceMonitorData] = useState<any>()

    useEffect(() => {
        fetchInstanceMonitorData()
    }, [])
    
    const _GetInstanceMonitoringAPI = () =>
        GetAPI({
            apiName: "InstanceMonitoring",
            serverManagerInformation: HTTPServerManager
        })

    const fetchInstanceMonitorData = async () => {
        const api = _GetInstanceMonitoringAPI()
        const response = await api.GetInstanceMonitorData({socketFileId})
        setInstanceMonitorData(response.data)
    }

    return <>
        {
            instanceMonitorData
            && <div className="page-header d-print-none">
                    <div className="container">
                        <div className="row g-3">
                            <div className="col">
                                <h2 className="page-title">
                                    {instanceMonitorData.startupArguments.packagePath}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
        }
        <div className="page-body">
            <div className="container-xl">
                {
                    instanceMonitorData
                    && <div className="row row-cards">
                            {
                                instanceMonitorData?.processInformation
                                && <div className="col-md-2">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="subheader mb-2">Process Information</div>

                                                <div>PID: <strong>{instanceMonitorData.processInformation.pid}</strong></div>
                                                <div>Platform: <strong>{instanceMonitorData.processInformation.platform}</strong></div>
                                                <div>Architecture: <strong>{instanceMonitorData.processInformation.arch}</strong></div>

                                            </div>
                                        </div>
                                    </div>
                            }

                            {
                                instanceMonitorData?.instanceTasks
                                && <div className="col-12">
                                        <div className="card">
                                            <div className="card-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>STATUS</th>
                                                            <th>TID</th>
                                                            <th>PTID</th>
                                                            <th>Object Loader Type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            instanceMonitorData.instanceTasks
                                                            .map((taskData) => {

                                                                const {
                                                                    taskId,
                                                                    pTaskId,
                                                                    objectLoaderType,
                                                                    status
                                                                } = taskData

                                                                return <tr>
                                                                            <td>{status}</td>
                                                                            <td>{taskId}</td>
                                                                            <td>{pTaskId}</td>
                                                                            <td>{objectLoaderType}</td>
                                                                        </tr>
                                                            })
                                                        }
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                }
                
            </div>
        </div>
    </>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(InstanceMonitorContainer)
