import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Editor from "@monaco-editor/react"

import GetAPI from "../../Utils/GetAPI"

//@ts-ignore
import logoVirtualDesk2 from "../../../Assets/logo-virtual-desk2.svg"

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

const iconPackage = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-package"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>
const iconStack2 = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-stack-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></svg>
const iconPackages = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-packages"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M2 13.5v5.5l5 3" /><path d="M7 16.545l5 -3.03" /><path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M12 19l5 3" /><path d="M17 16.5l5 -3" /><path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" /><path d="M7 5.03v5.455" /><path d="M12 8l5 -3" /></svg>
const iconApps = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-apps"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 7l6 0" /><path d="M17 4l0 6" /></svg>
const iconAppWindow = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-app-window"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M6 8h.01" /><path d="M9 8h.01" /></svg>
const iconTerminal2 = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-terminal-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9l3 3l-3 3" /><path d="M13 15l3 0" /><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>
const iconFolder = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" /></svg>
const iconFile = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>

const IsPackage = (typeItem) => {
    return ["app", "cli", "webapp", "webgui", "webservice", "service", "lib"].indexOf(typeItem) > -1
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

    return <div className="col-12 bg-muted-lt">
        <div className="row justify-content-between align-items-center p-1 bg-muted text-muted-fg">
            <div className="col">
                <strong>repository structure</strong>
            </div>
            <div className="col-auto">
                <button className="btn btn-sm btn-ghost-light"><svg xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-plus m-0"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg></button>
                <button className="btn btn-sm btn-ghost-dark">{iconCaretDown}</button>
            </div>
        </div>
        <div className="p-2">
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
    </div>
}


const PackageSourceTreeSidebarSection = ({
    sourceTree,
    onSelectSourceFile
}) => {

    const [expandedItems, setExpandedItems] = useState({})

    const toggleExpand = (code) => {
        setExpandedItems((prev) => ({ ...prev, [code]: !prev[code] }))
    }

    const getHandleSelectPackageFile = (itemData) => () => onSelectSourceFile(`${itemData.path}/${itemData.name}`)

    const renderHierarchy = (items) => {

        return (
            <ul className="list-group">
                {
                    items.map((item) => {

                        const code = item.path+item.name+item.type
                        const hasLevel = item.children && item.children.length > 0

                        return <li key={code} className="list-group-item border-0 p-0 cursor-pointer">
                            <div className="d-flex align-items-center">
                                {
                                    hasLevel
                                    && <button className="btn btn-sm btn-link" onClick={() => toggleExpand(code)}>
                                        {expandedItems[code] ? iconCaretDown : iconCaretRight}
                                    </button>
                                }
                                <span className={hasLevel?"":"ms-4"} onClick={item.type === "file" && getHandleSelectPackageFile(item)}>
                                    {
                                            IsPackage(item.type)
                                                ? iconPackage
                                                : item.type === "directory"
                                                    ? iconFolder
                                                    : item.type === "file"
                                                        ? iconFile
                                                        : ""
                                        } {item.name}
                                </span>

                            </div>
                            {
                                item.children
                                && item.children.length > 0
                                && expandedItems[code]
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

    return <div className="col-12 mb-3 bg-azure-lt">
        <div className="justify-content-start align-items-center p-1 bg-azure text-azure-fg">
            <strong>package source code</strong>
        </div>
        <div className="p-2">
            {
                sourceTree?.length > 0
                    ? renderHierarchy(sourceTree)
                    : <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }
        </div>
        
    </div>
}

const PackageMetadataSidebarSection = ({
    sourceTree,
    onSelectSourceFile
}) => {

    const [expandedItems, setExpandedItems] = useState({})

    const toggleExpand = (code) => {
        setExpandedItems((prev) => ({ ...prev, [code]: !prev[code] }))
    }

    const getHandleSelectPackageFile = (itemData) => () => onSelectSourceFile(`${itemData.path}/${itemData.name}`)

    const renderHierarchy = (items) => {

        return (
            <ul className="list-group">
                {
                    items.map((item) => {

                        const code = item.path+item.name+item.type
                        const hasLevel = item.children && item.children.length > 0

                        return <li key={code} className="list-group-item border-0 p-0 cursor-pointer">
                            <div className="d-flex align-items-center">
                                {
                                    hasLevel
                                    && <button className="btn btn-sm btn-link" onClick={() => toggleExpand(code)}>
                                        {expandedItems[code] ? iconCaretDown : iconCaretRight}
                                    </button>
                                }
                                <span className={hasLevel?"":"ms-4"} onClick={item.type === "file" && getHandleSelectPackageFile(item)}>
                                    {
                                            IsPackage(item.type)
                                                ? iconPackage
                                                : item.type === "directory"
                                                    ? iconFolder
                                                    : item.type === "file"
                                                        ? iconFile
                                                        : ""
                                        } {item.name}
                                </span>

                            </div>
                            {
                                item.children
                                && item.children.length > 0
                                && expandedItems[code]
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

    return <div className="col-12 bg-indigo-lt">
        <div className="justify-content-start align-items-center p-1 bg-indigo text-indigo-fg">
            <strong>package metadata</strong>
        </div>
        <div className="p-2">
            {
                sourceTree?.length > 0
                    ? renderHierarchy(sourceTree)
                    : <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }
        </div>
        
    </div>
}

const RepositoryMetadataSidebarSection = ({
    applicationsMetadata,
}) => {

    const [expanded, setExpanded] = useState(false)

    const toggleExpand = () => setExpanded(!expanded)


    return <div className="col-12 border-bottom bg-dark-lt">
        <div className="justify-content-start align-items-center p-1 bg-dark text-dark-fg">
            <strong>repository metadata</strong>
        </div>
        {
            applicationsMetadata?.length > 0
                ? <ul className="list-group m-2">
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
                                            .map(({ executable, appType }) => <li className="list-group-item border-0 p-0 cursor-pointer">
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
const PACKAGE_ITEM_TYPE_LIST = ["lib", "service", "webservice", "webgui", "webpapp", "app", "cli"]

const RepositoryEditorContainer = ({ repositoryId, HTTPServerManager }) => {

    const [repositoryInformation, setRepositoryInformation] = useState<any>()
    const [repositoryHierarchy, setRepositoryHierarchy] = useState([])
    const [repoItemSelectedId, setRepoItemSelectedId] = useState()
    const [applicationsMetadata, setApplicationsMetadata] = useState()

    const [ itemDataSelected, setItemDataSelected] = useState<any>()

    const [ isPackageSelected, setIsPackageSelected ] = useState(false)
    const [ packageSourceCodeTreeCurrent, setPackageSourceCodeTreeCurrent] = useState()
    const [ packageMetadataCurrent, setPackageMetadataTreeCurrent] = useState()
    const [ sourceFileContentData, setSourceFileContentData ] = useState<any>()

    useEffect(() => {
        fetchRepositoryHierarchy()
        fetchRepositoryInformation()
        fetchRepositoryApplications()
    }, [])

    useEffect(() =>{

        if(repoItemSelectedId){
            fetchItemInformation()
        }

    }, [repoItemSelectedId])

    useEffect(() => {

        if (itemDataSelected && PACKAGE_ITEM_TYPE_LIST.indexOf(itemDataSelected.itemType) > -1) {
            fetchPackageSourceTree()
            fetchPackageMetadata()
            setIsPackageSelected(true)
        }else {
            setIsPackageSelected(false)
        }

    }, [itemDataSelected])

    const GetMyWorkspaceAPI = () =>
        GetAPI({
            apiName: "MyWorkspace",
            serverManagerInformation: HTTPServerManager
        })

    const fetchRepositoryHierarchy = async () => {
        setRepositoryHierarchy([])
        const response = await GetMyWorkspaceAPI().GetItemHierarchy({ repositoryId })
        setRepositoryHierarchy(response.data)
    }

    const fetchRepositoryInformation = async () => {
        setRepositoryInformation(undefined)
        const response = await GetMyWorkspaceAPI().GetRepositoryGeneralInformation({ repositoryId })
        setRepositoryInformation(response.data)
    }

    const fetchItemInformation = async () => {
        setItemDataSelected(undefined)
        const response = await GetMyWorkspaceAPI().GetItemInformation({ itemId:repoItemSelectedId })
        setItemDataSelected(response.data)
    }

    const fetchRepositoryApplications = async () => {
        setApplicationsMetadata(undefined)
        const response = await GetMyWorkspaceAPI().GetApplicationsRepositoryMetatadata({ repositoryId })
        setApplicationsMetadata(response.data)
    }

    const fetchPackageSourceTree = async () => {
        setPackageSourceCodeTreeCurrent(undefined)
        const response = await GetMyWorkspaceAPI().GetPackageSourceTree({ itemId:repoItemSelectedId })
        setPackageSourceCodeTreeCurrent(response.data)
    }

    const fetchPackageMetadata = async () => {
        setPackageMetadataTreeCurrent(undefined)
        const response = await GetMyWorkspaceAPI().GetPackageMetadata({ itemId:repoItemSelectedId })
        setPackageMetadataTreeCurrent(response.data)
    }

    const getPackageSourceFileContent = async (sourceFilePath) => {
        const response = await GetMyWorkspaceAPI().GetPackageSourceFileContent({ 
            itemId:repoItemSelectedId,
            sourceFilePath
        })
        return response.data
    }

    const selectSourceFile = async (sourceFilePath) => {
        setSourceFileContentData(undefined)
        const sourceFileContentData = await getPackageSourceFileContent(sourceFilePath)
        setSourceFileContentData(sourceFileContentData)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" style={{ zIndex: 9999 }}>
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center p-0" href="#/apps">
                        <img src={logoVirtualDesk2} width={150} className="me-2" />
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
                <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column" style={{ width: "auto", position: "relative", overflowY: "auto" }}>
                    <RepositoryMetadataSidebarSection applicationsMetadata={applicationsMetadata} />
                    <RepositoryItemSidebarSection repoItemSelectedId={repoItemSelectedId} onSelectItem={(id) => setRepoItemSelectedId(id)} repositoryHierarchy={repositoryHierarchy} />
                </aside>

                <div className="page-wrapper flex-grow-1 d-flex flex-column" style={{ overflowY: "auto", minWidth: 0, paddingTop: ".5rem", margin: 0 }}>
                    <div className="container-fluid flex-grow-1 d-flex p-0">
                        <div className="row flex-grow-1 m-0">
                            <div className="col-12">
                                <div className="card-tabs">

                                    <ul className="nav nav-tabs" role="tablist">
                                        {sourceFileContentData && <li className="nav-item"><a className="nav-link active">{sourceFileContentData.sourceFilePath} <span className="text-secondary ms-1">{sourceFileContentData.packageParent}</span></a></li>}
                                    </ul>
                                    <div className="tab-content flex-grow-1 d-flex">
                                        <div id="tab-top-1" className="card tab-pane active show flex-grow-1 d-flex flex-column">
                                            {sourceFileContentData && (
                                                <div className="card-body d-flex flex-column flex-grow-1 p-0">
                                                    <Editor
                                                        height="calc(105vh - 163px)" // Garante que o editor ocupa todo o espaço disponível
                                                        defaultLanguage="javascript"
                                                        value={sourceFileContentData?.content || ""} // Evita erro se content for undefined
                                                        options={{
                                                            readOnly: true,
                                                            minimap: { enabled: false },
                                                            fontSize: 14,
                                                            wordWrap: "on",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    isPackageSelected
                    && <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column border-start" style={{ width: "auto", position: "relative", margin: 0, overflowY: "auto" }}>
                            <PackageMetadataSidebarSection 
                                onSelectSourceFile={(sourceFilePath) => selectSourceFile(sourceFilePath)}
                                sourceTree={packageSourceCodeTreeCurrent}/>

                            <PackageSourceTreeSidebarSection 
                                onSelectSourceFile={(sourceFilePath) => selectSourceFile(sourceFilePath)}
                                sourceTree={packageSourceCodeTreeCurrent}/>
                        </aside>
                }
            </div>
        </>
    )
}


const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryEditorContainer)
