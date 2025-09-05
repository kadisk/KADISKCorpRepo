import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const DEFAULT_MODE = Symbol()
const REPOSITORY_MANAGER_MODE = Symbol()
const UPDATE_REPOSITORY_MODE = Symbol()
const UPDATING_REPOSITORY_MODE = Symbol()

const TAR_GZ_UPLOAD_IMPORT_TYPE = Symbol("TAR_GZ_UPLOAD")
const GIT_CLONE_IMPORT_TYPE    = Symbol("GIT_CLONE")

//MyServicesManager

const NamespaceAndRepositoryManagerModal = ({
    onClose,
    onImportNew,
    HTTPServerManager
}) => {

    const [ mode, setMode ] = useState<any>(DEFAULT_MODE)
    const [ namespaces, setNamespaces ] = useState([])
    const [ repositories, setRepositories ] = useState([])
    const [ namespaceIdSelected, setNamespaceIdSelected ] = useState(undefined)
    const [ namespaceSelected, setNamespaceSelected ] = useState(undefined)

    const [ readyForUpdate, setReadyForUpdate ] = useState(false)
    const [ formUpdateValues, setFormUpdateValues ] = useState<any>({})
    const [ repositoryFileForUpload, setRepositoryFileForUpload ] = useState()

    const [ importType,  setImportType] = useState(undefined)

    useEffect(() => {
        if(formValuesIsValid()){
            setReadyForUpdate(true)
        }
    }, [formUpdateValues])

    useEffect(() => {
        FetchNamespaces()
    }, [])

    useEffect(() => {
        if(mode === UPDATE_REPOSITORY_MODE){
            setReadyForUpdate(false)
            setFormUpdateValues({})

            if(importType === GIT_CLONE_IMPORT_TYPE){
                const [ recentRepositoryImported ] = repositories
                const { sourceParams } = recentRepositoryImported
                setFormUpdateValues(sourceParams)                
            }
        }
    }, [mode])

    useEffect(() => {
        if(namespaceIdSelected){
            FetchRepositories()
        }
    }, [namespaceIdSelected])

    const formValuesIsValid = () => {
        const nTotal = Object.keys(formUpdateValues).length
        if(nTotal > 0){
            const nValidItem =  Object.values(formUpdateValues).filter((values) => values && values != "").length
            const isNValidItem = nValidItem === Object.keys(formUpdateValues).length

            const isFormContentValid =
                (importType === TAR_GZ_UPLOAD_IMPORT_TYPE && repositoryFileForUpload)
                || (importType === GIT_CLONE_IMPORT_TYPE && formUpdateValues.repositoryGitUrl && formUpdateValues.personalAccessToken)  


            return isNValidItem && isFormContentValid
        }
        return false
    }

    const _GetRepositoryServiceManager = () =>
        GetAPI({
            apiName: "RepositoryServiceManager",
            serverManagerInformation: HTTPServerManager
        })
    
    const _GetMyServicesManager = () =>
        GetAPI({
            apiName: "MyServicesManager",
            serverManagerInformation: HTTPServerManager
        })

    const FetchNamespaces = async () => {
        const api = _GetRepositoryServiceManager()
        const response = await api.ListNamespaces()
        setNamespaces(response.data)
    }

    const FetchRepositories = async () => {
        setRepositories([])
        const api = _GetRepositoryServiceManager()
        const response = await api.ListRepositories({namespaceId: namespaceIdSelected})
        setRepositories(response.data)
    }

    const ActiveManagerRepositoriesMode = (id, namespace) => {
        setMode(REPOSITORY_MANAGER_MODE)
        setNamespaceIdSelected(id)
        setNamespaceSelected(namespace)
    }

    const ActiveDefaultMode = () => {
        setMode(DEFAULT_MODE)
        setNamespaceIdSelected(undefined)
        setNamespaceSelected(undefined)
    }

    const ActiveUpdateRepositoryMode = () => {
        setMode(UPDATE_REPOSITORY_MODE)

        const [ recentRepositoryImported ] = repositories

        const { sourceType } = recentRepositoryImported

        if(sourceType === "GIT_CLONE"){
            setImportType(GIT_CLONE_IMPORT_TYPE)
        } else if(sourceType === "TAR_GZ_UPLOAD"){
            setImportType(TAR_GZ_UPLOAD_IMPORT_TYPE)
        } else {
            setImportType(undefined)
        }

    }

    const handleChangeFormUpdate = (event) => {
        const { name, value } = event.target
        setFormUpdateValues(prevValues => ({ ...prevValues, [name]: value }))
    }

    const isSelected = (_importType) => importType === _importType
    const createHandleType    = (_importType) => () => setImportType(_importType)
    const handleFileChangeForUploadForUpload = (event) => setRepositoryFileForUpload(event.target.files[0])

    const BackToRepositoryManagerMode = () => {
        setMode(REPOSITORY_MANAGER_MODE)
    }

    const handleUpdateRepository = async () => {

        setMode(UPDATING_REPOSITORY_MODE)

        if(importType === GIT_CLONE_IMPORT_TYPE){
            const { repositoryGitUrl, personalAccessToken } = formUpdateValues
            await _GetRepositoryServiceManager().UpdateRepositoryWithGitClone({
                namespaceId: namespaceIdSelected,
                repositoryGitUrl,
                personalAccessToken
            })
            await FetchRepositories()
            BackToRepositoryManagerMode()
        } else if(importType === TAR_GZ_UPLOAD_IMPORT_TYPE){
            await _GetRepositoryServiceManager()
            .UpdateRepositoryWithUpload({
                namespaceId: namespaceIdSelected,
                repositoryFile: repositoryFileForUpload
            })
        }

        setMode(REPOSITORY_MANAGER_MODE)
        FetchRepositories()
    }

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Namespace and repository manager</h5>
                    <button type="button" className="btn-close" onClick={onClose}/>
                </div>
                {
                    (mode === REPOSITORY_MANAGER_MODE || mode === UPDATE_REPOSITORY_MODE ||  mode === UPDATING_REPOSITORY_MODE)
                    && namespaceSelected
                    && <div className="modal-body bg-primary-lt">
                            <ol className="breadcrumb breadcrumb-muted" aria-label="breadcrumbs">
                                <li className="breadcrumb-item">
                                    <a className="cursor-pointer" onClick={() => ActiveDefaultMode()}>Manager</a>    
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    <a href="#">{namespaceSelected}</a>
                                </li>
                            </ol>
                        </div>
                }
                {
                    mode === UPDATING_REPOSITORY_MODE
                    && <div className="empty">
                            <p style={{fontSize:"1.8em"}}>Importing <strong>{namespaceSelected}</strong>...</p>
                            <div className="progress progress-sm">
                                <div className="progress-bar progress-bar-indeterminate"></div>
                            </div>
                        </div>
                }
                {
                    mode === DEFAULT_MODE
                    && <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-vcenter card-table table-striped">
                                <thead>
                                    <tr>
                                    <th>ID</th>
                                    <th>Namespace</th>
                                    <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        namespaces
                                        .map(({id, namespace}) => <tr>
                                                                        <td className="text-secondary">{id}</td>
                                                                        <td className="text-secondary">{namespace}</td>
                                                                        <td>
                                                                            <div className="btn-list flex-nowrap">
                                                                                <button className="btn btn-1" onClick={() => ActiveManagerRepositoriesMode(id, namespace)}>manage</button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>)
                                    }
                                </tbody>
                                </table>
                            </div>
                        </div>
                }
                {
                    mode === UPDATE_REPOSITORY_MODE
                    && <div className="modal-body">
                            <form className="row row-cards" onChange={handleChangeFormUpdate}>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <div className="form-selectgroup">
                                            <label className="form-selectgroup-item bg-cyan-lt">
                                                <input type="radio" name="icons" value="circle" className="form-selectgroup-input" checked={isSelected(GIT_CLONE_IMPORT_TYPE)} onChange={createHandleType(GIT_CLONE_IMPORT_TYPE)}/>
                                                <span className="form-selectgroup-label">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="me-1 icon icon-tabler icons-tabler-outline icon-tabler-brand-git"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 15v-6" /><path d="M15 11l-2 -2" /><path d="M11 7l-1.9 -1.9" /><path d="M13.446 2.6l7.955 7.954a2.045 2.045 0 0 1 0 2.892l-7.955 7.955a2.045 2.045 0 0 1 -2.892 0l-7.955 -7.955a2.045 2.045 0 0 1 0 -2.892l7.955 -7.955a2.045 2.045 0 0 1 2.892 0z" /></svg>
                                                    git clone
                                                </span>
                                            </label>
                                            <label className="form-selectgroup-item bg-cyan-lt">
                                                <input type="radio" name="icons" value="home" className="form-selectgroup-input" checked={isSelected(TAR_GZ_UPLOAD_IMPORT_TYPE)} onChange={createHandleType(TAR_GZ_UPLOAD_IMPORT_TYPE)}/>
                                                <span className="form-selectgroup-label">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="me-1 icon icon-tabler icons-tabler-outline icon-tabler-file-zip"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1" /><path d="M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2z" /><path d="M11 5l-1 0" /><path d="M13 7l-1 0" /><path d="M11 9l-1 0" /><path d="M13 11l-1 0" /><path d="M11 13l-1 0" /><path d="M13 15l-1 0" /></svg>
                                                    upload local repository
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    isSelected(TAR_GZ_UPLOAD_IMPORT_TYPE)
                                    && <div className="col-12 mt-0">
                                            <div className="card bg-cyan-lt">
                                                <div className="card-body">
                                                    <label className="form-label">upload local repository</label>
                                                    <input type="file" className="form-control" onChange={handleFileChangeForUploadForUpload} />
                                                    <small className="form-text">compressed with *.zip or *.tar.gz</small>
                                                </div>
                                            </div>
                                        </div>
                                }     
                                {
                                    isSelected(GIT_CLONE_IMPORT_TYPE)
                                    && <div className="col-12 mt-0">
                                            <div className="card bg-cyan-lt">
                                                <div className="card-body pb-1">
                                                    <div>
                                                        <div className="form-floating mb-3">
                                                            <input type="text" defaultValue={formUpdateValues["repositoryGitUrl"]} className="form-control" name="repositoryGitUrl"/>
                                                            <label>Repository URL</label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="form-floating mb-3">
                                                            <input type="text" defaultValue={formUpdateValues["personalAccessToken"]} className="form-control" name="personalAccessToken"/>
                                                            <label>Personal Access Token (PAT)</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }

                            </form>
                        </div>
                }
                {
                    mode === REPOSITORY_MANAGER_MODE
                    && <div className="modal-body">
                            <div className="card">
                                <div className="card-header ps-3 p-2">
                                    <h3 className="card-title">Last respositories imported</h3>
                                </div>
                                <div className="card-body">
                                    
                                    <div className="list-group list-group-flush list-group-hoverable">
                                        <div className="list-group-item">
                                            {
                                                repositories
                                                .map(({ id, createdAt, sourceType, sourceParams }) => 
                                                    <div className="row align-items-center">
                                                        <div className="col text-truncate">
                                                            <div className="text-truncate"><strong>{createdAt}</strong></div>
                                                            <div className="d-block text-secondary text-truncate mt-n1">{sourceType}</div>
                                                        </div>
                                                        <code>{JSON.stringify(sourceParams, null, 2)}</code>
                                                    </div>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
                {
                    mode === DEFAULT_MODE
                    && <div className="modal-footer">
                            <button className="btn btn-link link-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="btn btn-cyan" onClick={onImportNew}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
                                Import new repository
                            </button>
                        </div>
                }
                {
                    mode === REPOSITORY_MANAGER_MODE
                    && <div className="modal-footer">
                            <button className="btn btn-link link-secondary" onClick={() => ActiveDefaultMode()}>
                                Cancel
                            </button>
                            <button className="btn btn-cyan"onClick={() => ActiveUpdateRepositoryMode()}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 16v6" /><path d="M22 19l-3 3l-3 -3" /></svg>
                                Update repository
                            </button>
                        </div>
                }
                {
                    mode === UPDATE_REPOSITORY_MODE
                    && <div className="modal-footer">
                            <button className="btn btn-link link-secondary" onClick={() => BackToRepositoryManagerMode()}>
                                Cancel
                            </button>
                            <button className="btn btn-orange" disabled={!readyForUpdate} onClick={() => handleUpdateRepository()}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-download"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>
                                Update
                            </button>
                        </div>
                }
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(NamespaceAndRepositoryManagerModal)
