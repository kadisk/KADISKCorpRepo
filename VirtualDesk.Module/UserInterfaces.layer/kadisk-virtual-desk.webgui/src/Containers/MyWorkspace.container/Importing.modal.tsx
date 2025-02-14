import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const ImportingModal = ({
    onClose,
    repositoryNamespace,
    sourceCodeURL,
    HTTPServerManager
}) => {

    useEffect(() => {
        ImportRepository()
    }, [])

    const _GetMyWorkspaceAPI = () => 
        GetAPI({ 
            apiName:"MyWorkspace",  
            serverManagerInformation: HTTPServerManager
        })


    const ImportRepository = async () => {
        const api = _GetMyWorkspaceAPI()
        const response = await api.ImportRepository({
            repositoryNamespace, 
            sourceCodeURL
        })
        console.log(response.data)
    }

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-body">
                    <div className="empty">
                        <p style={{fontSize:"1.8em"}}>Importing <strong>{repositoryNamespace}</strong>...</p>
                        <div className="progress progress-sm">
                            <div className="progress-bar progress-bar-indeterminate"></div>
                        </div>
                        <p className="empty-subtitle text-secondary mt-2">{sourceCodeURL}</p>
                        <p className="empty-subtitle mt-2">Downloading...</p>
                    </div>
                </div>


            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ImportingModal)
