import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Editor from "@monaco-editor/react"

import GetAPI from "../../Utils/GetAPI"

//@ts-ignore
import logoVirtualDesk2 from "../../../Assets/logo-virtual-desk2.svg"

import RepositoryItemSidebarSection from "./SidebarSections/RepositoryItem.sidebarSection"
import PackageSourceTreeSidebarSection from "./SidebarSections/PackageSourceTree.sidebarSection"
import PackageMetadataSidebarSection from "./SidebarSections/PackageMetadata.sidebarSection"
import RepositoryMetadataSidebarSection from "./SidebarSections/RepositoryMetadata.sidebarSection"

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
