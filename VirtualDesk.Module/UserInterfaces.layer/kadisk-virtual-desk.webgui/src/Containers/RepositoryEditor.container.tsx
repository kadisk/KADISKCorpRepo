import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"
import WelcomeFooter from "../PageComponents/WelcomeFooter"

//@ts-ignore
import logoVirtualDesk2 from "../../Assets/logo-virtual-desk2.svg"

const RepositoryEditorContainer = ({ repositoryId, HTTPServerManager }) => {
    const [repositoryHierarchy, setRepositoryHierarchy] = useState([])
    const [expandedItems, setExpandedItems] = useState({})

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

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const renderHierarchy = (items) => {
        return (
            <ul className="list-group">
                {items.map((item) => (
                    <li key={item.id} className="list-group-item border-0 p-0 cursor-pointer">
                        <div className="d-flex align-items-center">
                            {item.children && item.children.length > 0 && (
                                <button 
                                    className="btn btn-sm btn-link" 
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    {expandedItems[item.id] ? "▼" : "▶"}
                                </button>
                            )}
                            <span>{item.itemName} <span className="text-secondary">{item.itemType}</span></span>
                        </div>
                        {item.children && item.children.length > 0 && expandedItems[item.id] && (
                            <div className="ms-2 mt-1 border-start ps-2">
                                {renderHierarchy(item.children)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
            {/* Sidebar */}
            <aside 
                className="navbar navbar-vertical navbar-expand-lg flex-shrink-0 d-flex flex-column" 
                style={{ height: "100%", minWidth: "max-content" }}
            >
                <div className="col-12" style={{ flex: "0 0 auto" }}>
                    <div 
                        className="ps-3 d-flex align-items-start border-bottom" 
                        style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}
                    >
                        <div>
                            <div className="page-pretitle">Repository Editor</div>
                            <h2 className="page-title" style={{ color: "black", marginBottom: "0" }}>Essential</h2>
                        </div>
                    </div>
                </div>
                <div 
                    className="p-3 col-12" 
                    style={{ flex: "1 1 auto", overflowY: "auto", overflowX: "hidden" }}
                >
                    {repositoryHierarchy.length > 0 
                        ? renderHierarchy(repositoryHierarchy) 
                        : <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                    }
                </div>
            </aside>

            {/* Main content area */}
            <div 
                className="page-wrapper flex-grow-1 d-flex flex-column" 
                style={{ overflowY: "auto", flex: 1, display: "flex", minWidth: 0, marginLeft: 0 }}
            >
                <div className="container-fluid flex-grow-1 d-flex p-0">
                    <div className="row flex-grow-1 m-0">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body p-3">XPTOP</div>
                            </div>
                        </div>
                    </div>
                </div>
                <WelcomeFooter />
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryEditorContainer)
