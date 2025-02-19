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

    const getClassNameColor = (itemType) => {
        switch (itemType) {
            case "Module":
                return "bg-purple text-purple-fg"
            case "layer":
                return "bg-indigo text-indigo-fg"
            default:
                return "bg-indigo-lt"
        }
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
                            <span className={`badge me-2 ${getClassNameColor(item.itemType)}`}>{item.itemType}</span>
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
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
            <aside className="navbar navbar-vertical navbar-expand-lg flex-shrink-0 d-flex" style={{ height: "100%", overflowY: "auto", minWidth: "max-content", display: "flex", flexDirection: "column", position: "relative" }}>
                <div className="container-fluid">
                    <div className="navbar-brand">
                        <a href=".">
                            <img src={logoVirtualDesk2} width={200} />
                        </a>
                    </div>
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
            </aside>
            <div className="page-wrapper flex-grow-1 d-flex flex-column" style={{ overflowY: "auto", flex: 1, display: "flex", minWidth: 0, marginLeft: 0 }}>
                <div className="container-fluid flex-grow-1 d-flex p-0">
                    <div className="row flex-grow-1 m-0">
                        <div className="col-md-4">
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