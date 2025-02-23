import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"
import WelcomeFooter from "../PageComponents/WelcomeFooter"

//@ts-ignore
import logoVirtualDesk2 from "../../Assets/logo-virtual-desk2.svg"

const iconCaretRight = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-caret-right"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 18l6 -6l-6 -6v12" />
    </svg>
)

const iconCaretDown = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-caret-down"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 10l6 6l6 -6h-12" />
    </svg>
)

const iconPackage = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-package"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>
const iconStack2 = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-stack-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></svg>
const iconPackages = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-packages"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M2 13.5v5.5l5 3" /><path d="M7 16.545l5 -3.03" /><path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M12 19l5 3" /><path d="M17 16.5l5 -3" /><path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" /><path d="M7 5.03v5.455" /><path d="M12 8l5 -3" /></svg>
const iconApps = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-apps"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 7l6 0" /><path d="M17 4l0 6" /></svg>
const iconAppWindow = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-app-window"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M6 8h.01" /><path d="M9 8h.01" /></svg>
const iconTerminal2 = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-terminal-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9l3 3l-3 3" /><path d="M13 15l3 0" /><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>

const IsPackage = (typeItem) => {
    return ["app","cli","webapp","webgui","webservice","service","lib"].indexOf(typeItem) > -1
}


const RepositoryItemSidebarSection = ({
    repoItemSelectedId,
    onSelectItem,
    repositoryHierarchy
}) => {

    const [expandedItems, setExpandedItems] = useState({})

    const toggleExpand = (id) => {
        setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const renderHierarchy = (items) => {

        return (
            <ul className="list-group">
                {
                    items.map((item) => {

                        const content = <span onClick={() => onSelectItem(item.id)}>
                                            {
                                                IsPackage(item.itemType) 
                                                    ? iconPackage 
                                                    : item.itemType === "Module"
                                                        ? iconPackages
                                                        : item.itemType === "layer"
                                                            ? iconStack2
                                                            : ""
                                            } {item.itemName} <span className="text-secondary">{item.itemType}</span>
                                        </span>

                        return <li key={item.id} className="list-group-item border-0 p-0 cursor-pointer">
                                    <div className="d-flex align-items-center">
                                        {
                                            item.children 
                                            && item.children.length > 0
                                            && <button className="btn btn-sm btn-link" onClick={() => toggleExpand(item.id)}>
                                                    {expandedItems[item.id] ? iconCaretDown : iconCaretRight}
                                                </button>
                                        }
                                        {
                                            repoItemSelectedId === item.id
                                            ? <strong>{content}</strong>
                                            : content
                                        }
                                        
                                    </div>
                                    {
                                        item.children
                                        && item.children.length > 0
                                        && expandedItems[item.id] 
                                        && <div className="ms-2 mt-1 border-start ps-3">
                                                {renderHierarchy(item.children)}
                                            </div>
                                    }
                                </li>
                    })
                }
            </ul>
        )
    }

    return <div className="p-2 col-12">
                {
                    repositoryHierarchy.length > 0 
                    ? renderHierarchy(repositoryHierarchy)
                    : <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                }
            </div>
}


const RepositoryMetadataSidebarSection = ({
    applicationsMetadata,
}) => {

    const [ expanded, setExpanded ] = useState(false)

    const toggleExpand = () => setExpanded(!expanded)


    return <div className="p-2 col-12">
                {
                    applicationsMetadata?.length > 0 
                    ? <ul className="list-group">
                            <li className="list-group-item border-0 p-0 cursor-pointer">
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-sm btn-link" onClick={() => toggleExpand()}>
                                        {expanded ? iconCaretDown : iconCaretRight}
                                    </button>
                                    <span>
                                        {iconApps}Applications                    
                                    </span>
                                </div>
                                {
                                    expanded
                                    && <div className="ms-2 mt-1 border-start ps-3">
                                            <ul className="list-group">
                                                {
                                                    applicationsMetadata
                                                    .map(({executable, appType}) => <li className="list-group-item border-0 p-0 cursor-pointer">
                                                                    <div className="d-flex align-items-center">
                                                                        <span>
                                                                            {appType === "APP" ? iconAppWindow : ""}
                                                                            {appType === "CLI" ? iconTerminal2 : ""}
                                                                            {executable} <span className="text-secondary">{appType}</span>
                                                                        </span>

                                                                    </div>
                                                                </li>)
                                                }
                                            </ul>
                                        </div>
                                }
                            </li>
                        </ul>
                    : <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                }
            </div>
}


const RepositoryEditorContainer = ({ repositoryId, HTTPServerManager }) => {

    const [repositoryInformation, setRepositoryInformation] = useState<any>()
    const [repositoryHierarchy, setRepositoryHierarchy] = useState([])
    const [repoItemSelectedId, setRepoItemSelectedId] = useState()
    const [applicationsMetadata, setApplicationsMetadata] = useState()

    useEffect(() => {
        fetchRepositoryHierarchy()
        fetchRepositoryInformation()
        fetchRepositoryApplications()
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

    const fetchRepositoryInformation = async () => {
        setRepositoryInformation(undefined)
        const api = GetMyWorkspaceAPI()
        const response = await api.GetGeneralInformation({ repositoryId })
        setRepositoryInformation(response.data)
    }

    const fetchRepositoryApplications = async () => {
        setApplicationsMetadata(undefined)
        const api = GetMyWorkspaceAPI()
        const response = await api.GetApplicationsMetatadata({ repositoryId })
        setApplicationsMetadata(response.data)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" style={{ zIndex: 9999 }}>
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center p-0" href="#/apps">
                        <img src={logoVirtualDesk2} width={150} className="me-2"/>
                        <div className="ps-3 d-flex align-items-start">
                            <div>
                                <div className="page-pretitle">Repository Editor</div>
                                <h2 className="page-title" style={{ color: "black", marginBottom: "0" }}>
                                    {repositoryInformation?.repositoryNamespace}
                                </h2>
                            </div>
                        </div>
                    </a>
                </div>
            </nav>

            <div className="d-flex" style={{ height: "94vh", overflow: "hidden", marginTop: "56px" }}>
                <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column" style={{width: "auto", position: "relative", overflowY: "auto"}}>
                    <RepositoryMetadataSidebarSection applicationsMetadata={applicationsMetadata} />
                    <RepositoryItemSidebarSection repoItemSelectedId={repoItemSelectedId} onSelectItem={(id) => setRepoItemSelectedId(id)} repositoryHierarchy={repositoryHierarchy} />
                </aside>

                <div className="page-wrapper flex-grow-1 d-flex flex-column" style={{ overflowY: "auto", minWidth: 0, paddingTop: ".5rem", margin: 0 }}>
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

                <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column border-start" style={{width: "auto", position: "relative", margin: 0, overflowY: "auto"}}>
                    <RepositoryMetadataSidebarSection applicationsMetadata={applicationsMetadata} />
                    <RepositoryItemSidebarSection repoItemSelectedId={repoItemSelectedId} onSelectItem={(id) => setRepoItemSelectedId(id)} repositoryHierarchy={repositoryHierarchy} />
                </aside>
            </div>
        </>
    )
}


const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryEditorContainer)
