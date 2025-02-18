import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import WelcomeWorkspace from "./WelcomeWorkspace"

import CreateNewRepositoryModal from "./CreateNewRepository.modal"
import ImportRepositoryModal from "./ImportRepository.modal"
import ImportingModal from "./Importing.modal"

import PageHeader from "../../Components/PageHeader"

import GetAPI from "../../Utils/GetAPI"

const CREATE_MODE              = Symbol()
const IMPORT_SELECT_MODE       = Symbol()
const IMPORTING_MODE           = Symbol()
const DEFAULT_MODE             = Symbol()


const MyWorkspaceContainer = ({ HTTPServerManager }) => {

    const [ interfaceModeType,  setInterfaceModeType] = useState(DEFAULT_MODE)
    const [ repositoriesCurrent, setRepositoriesCurrent ] = useState<any[]>()
    const [ importDataCurrent, setImportDataCurrent ] = useState<{repositoryNamespace:string, sourceCodeURL:string}>()

    const [ repositoryIdSelected, setRepositoryIdSelected ] = useState()

    useEffect(() => {
        if(interfaceModeType === DEFAULT_MODE){
            fetchRepositories()
        }
    }, [interfaceModeType])

    const _GetMyWorkspaceAPI = () => 
        GetAPI({ 
            apiName:"MyWorkspace",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchRepositories = async () => {
        setRepositoriesCurrent(undefined)
        const api = _GetMyWorkspaceAPI()
        const response = await api.ListRepositories()
        setRepositoriesCurrent(response.data)
    }

    const changeMode = (mode) => setInterfaceModeType(mode)

    const handleCloseModal = () => setInterfaceModeType(DEFAULT_MODE)

    const handleCreatedRepository = () => setInterfaceModeType(DEFAULT_MODE)

    const handleFinishedImportModal = () => setInterfaceModeType(DEFAULT_MODE)

    const handleImportingMode = (importData) => {
        setImportDataCurrent(importData)
        changeMode(IMPORTING_MODE)
    }

    return <>
                <PageHeader>
                    <div className="col">
                        <div className="page-pretitle">Workbench</div>
                        <h2 className="page-title">My Workspace</h2>
                    </div>
                    
                    {
                        repositoriesCurrent
                        && repositoriesCurrent.length > 0
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
                                                                    repositoryNamespace={importDataCurrent.repositoryNamespace} 
                                                                    sourceCodeURL={importDataCurrent.sourceCodeURL}
                                                                    onFinishedImport={handleFinishedImportModal}/> }
                    <div className="container py-4">
                        {
                            repositoriesCurrent 
                            && <div className="row">
                                    {
                                        repositoriesCurrent.map((repo, index) => (
                                            <div key={index} className="col-md-4">
                                                <a className="card card-link cursor-pointer mb-3" href={`#/my-workspace/repository-explorer?repositoryId=${repo.id}`}>
                                                    <div className="card-header">
                                                        <h4 className="mb-0">{repo.namespace}</h4>
                                                        <div className="card-actions">
                                                            <button className="btn btn-ghost-info p-1">Repository Editor
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon ms-1 m-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="mb-2">Created at: <strong>{repo.createdAt}</strong></div>
                                                    </div>
                                                </a>
                                            </div>))
                                    }
                                </div>
                        }
                        {
                            !repositoriesCurrent && <p className="text-center text-muted">Loading repository...</p>
                        }
                        {
                            repositoriesCurrent 
                            && repositoriesCurrent.length === 0
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
