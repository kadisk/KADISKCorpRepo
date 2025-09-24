import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Editor from "@monaco-editor/react"

import GetAPI from "../../Utils/GetAPI"

//@ts-ignore
import logoVirtualDesk2 from "../../../Assets/logo-virtual-desk2.svg"

import SourceTreeSidebarSection  from "./SidebarSections/SourceTree.sidebarSection"
import MetadataSidebarSection    from "./SidebarSections/Metadata.sidebarSection"

const PACKAGE_ITEM_TYPE_LIST = ["lib", "service", "webservice", "webgui", "webpapp", "app", "cli"]

const PackageEditorContainer = ({ packageId, HTTPServerManager }) => {

    const [ packageData, setPackageData ]                                   = useState<any>()
    const [ packageSourceCodeTreeCurrent, setPackageSourceCodeTreeCurrent ] = useState<any>()
    const [ packageMetadataCurrent, setPackageMetadataTreeCurrent ]         = useState()
    const [ indexTabFocus, setIndexTabFocus ]                               = useState<number>(0)
    const [ tabsSelectedData, setTabsSelectedData ]                         = useState([])

    useEffect(() =>{
        fetchItemInformation()
    }, [])

    useEffect(() => {

        if (packageData && PACKAGE_ITEM_TYPE_LIST.indexOf(packageData.itemType) > -1) {
            fetchPackageSourceTree()
            fetchPackageMetadata()
        }

    }, [packageData])

    const GetMyWorkspaceAPI = () =>
        GetAPI({
            apiName: "MyWorkspace",
            serverManagerInformation: HTTPServerManager
        })


    const fetchItemInformation = async () => {
        setPackageData(undefined)
        const response = await GetMyWorkspaceAPI().GetItemInformation({ itemId:packageId })
        setPackageData(response.data)
    }

    const fetchPackageSourceTree = async () => {
        setPackageSourceCodeTreeCurrent(undefined)
        const response = await GetMyWorkspaceAPI().GetPackageSourceTree({ itemId:packageId })
        setPackageSourceCodeTreeCurrent(response.data)
    }

    const fetchPackageMetadata = async () => {
        setPackageMetadataTreeCurrent(undefined)
        const response = await GetMyWorkspaceAPI().GetPackageMetadata({ itemId:packageId })
        setPackageMetadataTreeCurrent(response.data)
    }

    const getPackageSourceFileContent = async (sourceFilePath) => {
        const response = await GetMyWorkspaceAPI().GetPackageSourceFileContent({ 
            itemId:packageId,
            sourceFilePath
        })
        return response.data
    }

    const openTab = ({ label, data }) => {
        setTabsSelectedData([...tabsSelectedData, { label, data }])
    }

    const selectSourceFile = async (sourceFilePath) => {
        const sourceFileContentData = await getPackageSourceFileContent(sourceFilePath)
        openTab({
            label: <strong>{sourceFileContentData.sourceFilePath}</strong>,
            data:sourceFileContentData
        })
    }

    const changeFocusTab = (indexTab) => setIndexTabFocus(indexTab)

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-azure-lt fixed-top" style={{ zIndex: 9999 }}>
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center p-0" href="#/my-workspace">
                        <img src={logoVirtualDesk2} width={150} className="me-2" />
                        <div className="ps-3 d-flex align-items-start">
                            <div>
                                <div className="page-pretitle">Package Editor</div>
                                <h2 className="page-title" style={{ color: "black", marginBottom: "0" }}>
                                    {packageData?.itemName}.{packageData?.itemType}
                                </h2>
                            </div>
                        </div>
                    </a>
                </div>
            </nav>

            <div className="d-flex" style={{ height: "94vh", overflow: "hidden", marginTop: "56px" }}>
                <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column" style={{ width: "auto", position: "relative", overflowY: "auto" }}>
                    <MetadataSidebarSection 
                        packageMetadata={packageMetadataCurrent}/>

                    
                    <SourceTreeSidebarSection 
                            onSelectSourceFile={(sourceFilePath) => selectSourceFile(sourceFilePath)}
                            sourceTree={packageSourceCodeTreeCurrent}/>
                </aside>

                <div className="page-wrapper flex-grow-1 d-flex flex-column" style={{ overflowY: "auto", minWidth: 0, paddingTop: ".5rem", margin: 0 }}>
                    <div className="container-fluid flex-grow-1 d-flex p-0">
                        <div className="row flex-grow-1 m-0">
                            <div className="col-12">
                                <div className="card-tabs">

                                    <ul className="nav nav-tabs" role="tablist">
                                        {
                                            tabsSelectedData
                                            .map(({label}, index) => <li className="nav-item cursor-pointer" onClick={() => changeFocusTab(index)}><a className={`nav-link ${index === indexTabFocus ?"active":""}`}>{label}</a></li>)
                                        }
                                    </ul>
                                    <div className="tab-content flex-grow-1 d-flex">
                                        <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                                            {tabsSelectedData[indexTabFocus] && (
                                                <div className="card-body d-flex flex-column flex-grow-1 p-0">
                                                    <Editor
                                                        height="calc(105vh - 163px)"
                                                        defaultLanguage="javascript"
                                                        value={tabsSelectedData[indexTabFocus]?.data.content || ""}
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
                                                </div>
                                            )}
                                        </div>
                                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PackageEditorContainer)
