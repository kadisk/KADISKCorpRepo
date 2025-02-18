import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

const RepositoryExplorerContainer = ({ repositoryId, HTTPServerManager }) => {
    const [repositoryHierarchy, setRepositoryHierarchy] = useState([])

    useEffect(() => {
        fetchRepositoryHierarchy()
    }, [])

    const GetMyWorkspaceAPI = () => 
        GetAPI({ 
            apiName: "MyWorkspace",  
            serverManagerInformation: HTTPServerManager
        })
    
    const fetchRepositoryHierarchy = async () => {
        setRepositoryHierarchy([])
        const api = GetMyWorkspaceAPI()
        const response = await api.GetItemHierarchy({ repositoryId })
        setRepositoryHierarchy(response.data)
    }

    const renderHierarchy = (items) => {
        return (
            <ul className="list-group">
                {items.map((item) => (
                    <li key={item.id} className="list-group-item border-0 p-1 cursor-pointer">
                        <div className="d-flex align-items-center">
                            <span className="me-2 text-primary">
                                <i className="ti ti-folder" />
                            </span>
                            <span className="badge bg-indigo text-indigo-fg me-1">{item.itemType}</span>
                            <span className="fw-bold fs-3">{item.itemName}</span>
                        </div>
                        {item.children && item.children.length > 0 && (
                            <div className="ms-4 mt-2 border-start ps-3">
                                {renderHierarchy(item.children)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="container-xl">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body p-3">
                            {repositoryHierarchy.length > 0 ? (
                                renderHierarchy(repositoryHierarchy)
                            ) : (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryExplorerContainer)
