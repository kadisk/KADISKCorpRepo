import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import WelcomeWorkspace from "./WelcomeWorkspace"

import CreateNewRepositoryModal from "./CreateNewRepository.modal"
import ImportRepositoryModal from "./ImportRepository.modal"
import ImportingModal from "./Importing.modal"

import ImportedRepositoriesOffcanvas from "./ImportedRepositories.offcanvas"

import PageHeader from "../../Components/PageHeader"

import GetAPI from "../../Utils/GetAPI"

const CREATE_MODE              = Symbol()
const IMPORT_SELECT_MODE       = Symbol()
const IMPORTING_MODE           = Symbol()
const DEFAULT_MODE             = Symbol()

const MyWorkspaceContainer = ({ HTTPServerManager }) => {

    const [ interfaceModeType,  changeMode] = useState<any>(DEFAULT_MODE)
    const [ repositoryNamespacesCurrent, setRepositoryNamespacesCurrent ] = useState<any[]>()
    const [ importDataCurrent, setImportDataCurrent ] = useState<{repositoryNamespace:string, sourceCodeURL:string}>()

    const [ namespaceIdSelected, setNamespaceIdSelected ] = useState()
    const [ namespaceSelected, setNamespaceSelected ] = useState()

    useEffect(() => {
        if(interfaceModeType === DEFAULT_MODE){
            fetchRepositoryNamespace()
        }
    }, [interfaceModeType])

    const _GetMyWorkspaceAPI = () => 
        GetAPI({ 
            apiName:"MyWorkspace",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchRepositoryNamespace = async () => {
        setRepositoryNamespacesCurrent(undefined)
        const api = _GetMyWorkspaceAPI()
        const response = await api.ListRepositoryNamespace()
        setRepositoryNamespacesCurrent(response.data)
    }

    const handleCloseModal = () => changeMode(DEFAULT_MODE)

    const handleCreatedRepository = () => changeMode(DEFAULT_MODE)

    const handleFinishedImportModal = () => changeMode(DEFAULT_MODE)

    const handleImportingMode = (importData) => {
        setImportDataCurrent(importData)
        changeMode(IMPORTING_MODE)
    }

    const handleCloseImportedRepositories = () => {
        setNamespaceIdSelected(undefined)
        setNamespaceSelected(undefined)
    }

    const handleSelectRepositoryNamespace = (id, namespace) => {
        setNamespaceIdSelected(id)
        setNamespaceSelected(namespace)
    }

    return <>
    {
                        namespaceIdSelected !== undefined
                        && <ImportedRepositoriesOffcanvas 
                                namespaceId={namespaceIdSelected}
                                namespace={namespaceSelected}
                                onClose={() => handleCloseImportedRepositories()} />
                    }
                <PageHeader>
                    <div className="col">
                        <div className="page-pretitle">Workbench</div>
                        <h2 className="page-title">My Workspaces</h2>
                    </div>
                    
                    {
                        repositoryNamespacesCurrent
                        && repositoryNamespacesCurrent.length > 0
                        && <div className="col-auto ms-auto d-print-none">
                                <div className="btn-list">
                                    <span className="d-none d-sm-inline">
                                        <button className="btn btn-primary" onClick={() =>  changeMode(CREATE_MODE)}>
                                            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                                            Create new repository
                                        </button>
                                    </span>
                                    <button className="btn btn-outline-primary" onClick={() => changeMode(IMPORT_SELECT_MODE)}>
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
                                        Import existing repository
                                    </button>
                                </div>
                            </div>
                    }
                </PageHeader>
                <div className="page-body">
                    {interfaceModeType === CREATE_MODE && <CreateNewRepositoryModal onCreated={handleCreatedRepository} onClose={handleCloseModal} />}
                    {interfaceModeType === IMPORT_SELECT_MODE && <ImportRepositoryModal onImport={handleImportingMode} onClose={handleCloseModal} />}
                    {interfaceModeType === IMPORTING_MODE && <ImportingModal 
                                                                    importData={importDataCurrent} 
                                                                    onFinishedImport={handleFinishedImportModal}/> }
                    <div className="container py-4">
                        {
                            repositoryNamespacesCurrent 
                            && <div className="row">
                                    {
                                        repositoryNamespacesCurrent.map(({ namespace, createdAt, id }, index) => (
                                            <div key={index} className="col-md-4">
                                                <div className="card card-link mb-3">
                                                    <div className="card-header py-2">
                                                        <h4 className="mb-0">{namespace}</h4>
                                                        <div className="card-actions">
                                                            <button className="btn btn-sm btn-ghost-info" onClick={() => handleSelectRepositoryNamespace(id, namespace)}>Imported repository</button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="mb-2">Created at: <strong>{createdAt}</strong></div>
                                                    </div>
                                                </div>
                                            </div>))
                                    }
                                </div>
                        }
                        {
                            !repositoryNamespacesCurrent && <p className="text-center text-muted">Loading repository...</p>
                        }
                        {
                            repositoryNamespacesCurrent 
                            && repositoryNamespacesCurrent.length === 0
                            && <WelcomeWorkspace
                                    onSelectCreateRepository={() => changeMode(CREATE_MODE)}
                                    onSelectImportRepository={() => changeMode(IMPORT_SELECT_MODE)}/>
                        }
                    </div>
                </div>
            </>
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(MyWorkspaceContainer)
