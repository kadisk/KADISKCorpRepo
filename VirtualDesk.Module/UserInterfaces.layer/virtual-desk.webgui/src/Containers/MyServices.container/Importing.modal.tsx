import * as React from "react"
import { useState, useEffect } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const ImportingModal = ({
    importData,
    onFinishedImport,
    HTTPServerManager
}) => {

    useEffect(() => {

        if(importData){
            const { repositoryNamespace, importType } = importData
    
            if(importType === "GITHUB_RELEASE"){
                /*const { sourceCodeURL } = importData
                ImportRepository({
                    repositoryNamespace,
                    sourceCodeURL
                })*/
            } else if(importType === "TAR_GZ_UPLOAD"){
                const { repositoryFile } = importData
                UploadRepository({
                    repositoryNamespace,
                    repositoryFile
                }) 
            } else if(importType === "GIT_CLONE"){
                const { repositoryGitUrl, personalAccessToken } = importData
                CloneRepository({
                    repositoryNamespace,
                    repositoryGitUrl,
                    personalAccessToken
                })
            }
        }


    }, [importData])


    const _GetMyServicesManagerAPI = () => 
        GetAPI({ 
            apiName:"MyServicesManager",  
            serverManagerInformation: HTTPServerManager
        })


    const UploadRepository = async ({
        repositoryNamespace,
        repositoryFile
    }) => {
        const response = await _GetMyServicesManagerAPI()
        .UploadRepository({
            repositoryNamespace,
            repositoryFile
        })
        onFinishedImport()
    }

    const CloneRepository = async ({
        repositoryNamespace,
        repositoryGitUrl,
        personalAccessToken
    }) => {
        const response = await _GetMyServicesManagerAPI()
        .CloneRepository({
            repositoryNamespace,
            repositoryGitUrl,
            personalAccessToken
        })
        onFinishedImport()
    }

    /*const ImportRepository = async ({
        repositoryNamespace,
        sourceCodeURL
    }) => {
        const response = await _GetMyWorkspaceAPI().ImportRepository({
            repositoryNamespace, 
            sourceCodeURL
        })
        onFinishedImport()
    }*/

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-body">
                    <div className="empty">
                        <p style={{fontSize:"1.8em"}}>Importing <strong>{importData.repositoryNamespace}</strong>...</p>
                        <div className="progress progress-sm">
                            <div className="progress-bar progress-bar-indeterminate"></div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ImportingModal)
