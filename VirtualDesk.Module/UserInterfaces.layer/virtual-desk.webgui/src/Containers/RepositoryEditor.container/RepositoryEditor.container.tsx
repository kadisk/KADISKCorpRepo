import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Editor from "@monaco-editor/react"

import GetAPI from "../../Utils/GetAPI"

//@ts-ignore
import logoVirtualDesk2 from "../../../Assets/logo-virtual-desk2.svg"

import RepositoryItemSidebarSection     from "./SidebarSections/RepositoryItem.sidebarSection"
import FileNavigatorSidebarSection      from "./SidebarSections/FileNavigator.sidebarSection"
import MetadataNavigatorSidebarSection  from "./SidebarSections/MetadataNavigator.sidebarSection"
import ApplicationsSidebarSection       from "./SidebarSections/Applications.sidebarSection"
import EndpointGroupSidebarSection      from "./SidebarSections/EndpointGroup.sidebarSection"
import ServicesSidebarSection           from "./SidebarSections/Services.sidebarSection"
import CommandGroupSidebarSection       from "./SidebarSections/CommandGroup.sidebarSection"

const PENCIL_CODE = <svg xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-pencil-code me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /><path d="M20 21l2 -2l-2 -2" /><path d="M17 17l-2 2l2 2" /></svg>

const PACKAGE_ITEM_TYPE_LIST = ["lib", "service", "webservice", "webgui", "webpapp", "app", "cli"]

const IsPackageItem = (itemType) => PACKAGE_ITEM_TYPE_LIST.indexOf(itemType) > -1

const X_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="m-0 icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>

const TabsContentView = ({ contentList, onCloseTab }) => {

    const [ indexTabFocus, setIndexFocus ] = useState(0)

    const changeFocusTab = (index) => setIndexFocus(index)

    const handleCloseTab = (indexForClose) => {

        if(indexForClose === indexTabFocus) {
            if(indexTabFocus > 0){
                setIndexFocus(indexTabFocus-1)
            } else if(indexTabFocus === 0 && contentList.length > 0){
                setIndexFocus(indexTabFocus+1)
            }
        } else if(indexForClose < indexTabFocus) {
            setIndexFocus(indexTabFocus-1)
        }

        onCloseTab(indexForClose)
    }

    return <div className="mt-2 card-tabs d-flex flex-column flex-grow-1" style={{ height: "100%" }}>

                <ul className="nav nav-tabs" role="tablist">
                    {
                        contentList
                        .map(({label, tabClassName}, index) => 
                        <li className="nav-item cursor-pointer" onClick={() => changeFocusTab(index)}>
                            <a className={`nav-link py-1 pe-0  ${tabClassName} ${index === indexTabFocus ?"active":""}`}>{index === indexTabFocus ? <strong>{label}</strong> :label}<button onClick={(e) => { e.stopPropagation(); handleCloseTab(index); }} className="btn btn-sm btn-link">{X_ICON}</button></a>
                        </li>)
                    }
                </ul>
                <div className="tab-content flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                    <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                         <div className="card-body d-flex flex-column flex-grow-1 p-0" style={{ minHeight: 0 }}>
                            {contentList[indexTabFocus]?.component}
                         </div>
                    </div>
                </div>
            </div>
}


const RepositoryEditorContainer = ({ repositoryId, HTTPServerManager }) => {

    const [ repositoryInformation, setRepositoryInformation ]               = useState<any>()
    const [ repositoryHierarchy, setRepositoryHierarchy ]                   = useState([])
    const [ repoItemSelectedId, setRepoItemSelectedId ]                     = useState()
    const [ applicationsMetadata, setApplicationsMetadata ]                 = useState()
    const [ itemDataSelected, setItemDataSelected ]                         = useState<any>()
    const [ isPackageSelected, setIsPackageSelected ]                       = useState(false)
    const [ packageSourceCodeTreeCurrent, setPackageSourceCodeTreeCurrent ] = useState<any>()
    const [ packageMetadataCurrent, setPackageMetadataTreeCurrent ]         = useState<any>()


    const [ contentOpenList, setContentOpenList ] = useState<any[]>([])

    useEffect(() => {
        fetchRepositoryHierarchy()
        fetchRepositoryInformation()
        fetchRepositoryApplications()
    }, [])

    useEffect(() =>{

        if(repoItemSelectedId)
            fetchItemInformation()

    }, [repoItemSelectedId])

    useEffect(() => {
        setContentOpenList([])
        if (itemDataSelected && IsPackageItem(itemDataSelected.itemType)) {
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

        const sourceFileContentData = await getPackageSourceFileContent(sourceFilePath)

        const { content } = sourceFileContentData

        setContentOpenList([
            ...contentOpenList,
            {
                label: sourceFilePath ? sourceFilePath.split(/[\\/]/).pop() : "",
                tabClassName: "bg-cyan-lt text-cyan-lt-fg",
                component: <Editor
                                height="calc(105vh - 22vh)"
                                defaultLanguage="javascript"
                                value={content || ""}
                                onMount={(editor, monaco) => {
                                    
                                    monaco.editor.defineTheme("myLightGrayTheme", {
                                    base: "vs",
                                    inherit: true,
                                    rules: [],
                                    colors: {
                                        "editor.background": "#e0f1ff"
                                    }
                                    })
                                    
                                    monaco.editor.setTheme("myLightGrayTheme")
                                }}
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: "on",
                                }}/>
            }
        ])
    }

    const findPathToId = function findPathToId(nodes: any[], targetId: any): any[] {
        if (!nodes || !targetId) return []
        for (const node of nodes) {
            const nodeId = node.id ?? node.itemId ?? node.Id ?? node.itemID
            if (nodeId === targetId) return [node]
            const childPath = findPathToId(node.children || [], targetId)
            if (childPath.length) return [node, ...childPath]
        }
        return []
    }

    const handleCloseTab = index => setContentOpenList(prev => prev.filter((_, i) => i !== index))

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-gray-300 fixed-top" style={{ zIndex: 9999 }}>
                <div className="container-fluid">
                    <div className="d-flex align-items-center p-0">
                        <img src={logoVirtualDesk2} width={150} className="me-2" />
                        <div className="ps-3 d-flex align-items-start">
                            <div>
                                <div className="page-pretitle">Repository Editor</div>
                                <h2 className="page-title" style={{ color: "black", marginBottom: "0" }}>
                                    {repositoryInformation?.repositoryNamespace}
                                </h2>
                            </div>
                        </div>
                        <ol className="breadcrumb breadcrumb-muted ms-3">
                            {
                                (() => {
                                    const targetId = itemDataSelected?.id ?? itemDataSelected?.itemId ?? itemDataSelected?.Id
                                    const path = targetId ? findPathToId(repositoryHierarchy, targetId) : []
                                    return path.map((item) => {
                   
                                        const isPackageItem = IsPackageItem(item.itemType)

                                        return <li className="breadcrumb-item" >
                                                    {
                                                        isPackageItem
                                                        ? <a href={`#/my-workspace/package-editor?packageId=${item.id}`}>{PENCIL_CODE}<strong>{item.itemName}.{item.itemType}</strong></a>
                                                        : <a>{item.itemName}.<i>{item.itemType}</i></a>
                                                    }
                                                </li>
                                    })
                                })()
                            }
                        </ol>
                    </div>

                </div>
            </nav>

            <div className="d-flex" style={{ height: "94vh", overflow: "hidden", marginTop: "56px" }}>
                <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column" style={{ width: "auto", position: "relative", overflowY: "auto" }}>
                    <ApplicationsSidebarSection applicationsMetadata={applicationsMetadata} />
                    <RepositoryItemSidebarSection repoItemSelectedId={repoItemSelectedId} onSelectItem={(id) => setRepoItemSelectedId(id)} repositoryHierarchy={repositoryHierarchy} />
                </aside>
                <div 
                    className="page-wrapper flex-grow-1 d-flex flex-column" 
                    style={{ overflowY: "auto", minWidth: 0, paddingTop: ".5rem", margin: 0 }}>
                    <div className="container-fluid flex-grow-1 d-flex p-0">
                        <div className="row flex-grow-1 m-0">
                            <div className="col-12 p-0">
                                {
                                    packageMetadataCurrent
                                    && <div className="ps-3 d-flex align-items-start">
                                            <div>
                                                <div className="page-pretitle">Package Namespace</div>
                                                <h2 className="page-title" style={{ color: "black", marginBottom: "0" }}>
                                                    { packageMetadataCurrent?.package?.namespace }
                                                </h2>
                                            </div>
                                        </div>
                                }
                                <div className="d-flex align-items-start" style={{ gap: "1rem" }}>
                                    {
                                        isPackageSelected
                                        &&<>
                                            <aside className="mt-2 navbar navbar-vertical navbar-expand-lg d-flex flex-column border-start flex-shrink-0" style={{ width: "fit-content", maxWidth: "480px", position: "relative", margin: 0, overflowY: "auto" }}>
                                                {
                                                    packageMetadataCurrent?.["command-group"]
                                                    && <CommandGroupSidebarSection 
                                                            commandGroupMetadata={packageMetadataCurrent["command-group"]}/>
                                                }
                                                {
                                                    packageMetadataCurrent?.services
                                                    && <ServicesSidebarSection 
                                                            servicesMetadata={packageMetadataCurrent.services}/>
                                                }
                                                {
                                                    packageMetadataCurrent?.["endpoint-group"]
                                                    && <EndpointGroupSidebarSection endpointGroupMetadata={packageMetadataCurrent["endpoint-group"]}/>
                                                }
                                                {
                                                    packageSourceCodeTreeCurrent?.length > 0
                                                    && <FileNavigatorSidebarSection 
                                                        onSelectSourceFile={(sourceFilePath) => selectSourceFile(sourceFilePath)}
                                                        sourceTree={packageSourceCodeTreeCurrent}/>
                                                }
                                                <MetadataNavigatorSidebarSection 
                                                    packageMetadata={packageMetadataCurrent}/>
                                                
                                            </aside>
                                            <TabsContentView contentList={contentOpenList} onCloseTab={handleCloseTab} />
                                        </>
                                    }

                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}


const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryEditorContainer)
