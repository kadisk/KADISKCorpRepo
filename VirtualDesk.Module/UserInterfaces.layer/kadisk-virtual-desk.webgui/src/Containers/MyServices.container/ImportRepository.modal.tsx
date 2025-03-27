import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const UPLOAD_LOCAL_IMPORT_TYPE   = Symbol()
const GITHUB_RELEASE_IMPORT_TYPE = Symbol()
const GIT_CLONE_IMPORT_TYPE      = Symbol()

const ImportRepositoryModal = ({
    onClose,
    onImport,
    HTTPServerManager
}) => {
    
    const [ readyForImport, setReadyForCreate ] = useState(false)
    const [ formValues, setFormValues ] = useState<any>({})
    const [ recordingMode, setRecordingMode ] = useState(false)

    const [ importType,  setImportType] = useState(UPLOAD_LOCAL_IMPORT_TYPE)

    const [ repositoryFileForUpload, setRepositoryFileForUpload ] = useState()

    useEffect(() => {

        if(formValuesIsValid()){
            if(importType === UPLOAD_LOCAL_IMPORT_TYPE && repositoryFileForUpload ){
                setReadyForCreate(true)
            }
        }

    }, [formValues])

    const formValuesIsValid = () => {
        const nTotal = Object.keys(formValues).length
        if(nTotal > 0){
            const nValidItem =  Object.values(formValues).filter((values) => values && values != "").length
            return nValidItem === Object.keys(formValues).length
        }
        return false
    }

    const getRepositoryImportManagerAPI = () => 
        GetAPI({ 
            apiName:"RepositoryImportManager",  
            serverManagerInformation: HTTPServerManager
        })

    const handleChangeForm = (event) => {
        const { name, value } = event.target
        setFormValues(prevValues => ({ ...prevValues, [name]: value }))
    }

    const handleImportRepository = () => {
        setRecordingMode(true)
        
        const { repositoryNamespace } = formValues

        switch(importType){
            case UPLOAD_LOCAL_IMPORT_TYPE:
                getRepositoryImportManagerAPI()
                .UploadRepository({
                    repositoryNamespace,
                    repositoryFile: repositoryFileForUpload
                })
                break
            default:
                throw "erro generico"
        }
    }

    const createHandleType    = (_importType) => () => setImportType(_importType)
    const isSelected          = (_importType) => importType === _importType
    const handleFileChange    = (event)       => setRepositoryFileForUpload(event.target.files[0])

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Repository Import</h5>
                    <button type="button" className="btn-close" onClick={onClose}/>
                </div>
                <div className="modal-body">
                    <form className="row row-cards" onChange={handleChangeForm}>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Repository Namespace</label>
                                <input disabled={recordingMode} type="text" className="form-control" placeholder="Repository Namespace" name="repositoryNamespace" /> 
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="mb-3">
                                <label className="form-label">import type</label>
                                <div className="form-selectgroup">
                                    <label className="form-selectgroup-item bg-cyan-lt">
                                        <input type="radio" name="icons" value="home" className="form-selectgroup-input" checked={isSelected(UPLOAD_LOCAL_IMPORT_TYPE)} onChange={createHandleType(UPLOAD_LOCAL_IMPORT_TYPE)}/>
                                        <span className="form-selectgroup-label">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="me-1 icon icon-tabler icons-tabler-outline icon-tabler-file-zip"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1" /><path d="M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2z" /><path d="M11 5l-1 0" /><path d="M13 7l-1 0" /><path d="M11 9l-1 0" /><path d="M13 11l-1 0" /><path d="M11 13l-1 0" /><path d="M13 15l-1 0" /></svg>
                                            upload local repository
                                        </span>
                                    </label>
                                    <label className="form-selectgroup-item bg-cyan-lt">
                                        <input type="radio" name="icons" value="user" className="form-selectgroup-input" checked={isSelected(GITHUB_RELEASE_IMPORT_TYPE)} onChange={createHandleType(GITHUB_RELEASE_IMPORT_TYPE)}/>
                                        <span className="form-selectgroup-label">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="me-1 icon icon-tabler icons-tabler-outline icon-tabler-brand-github"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
                                            import release to github
                                        </span>
                                    </label>
                                    <label className="form-selectgroup-item bg-cyan-lt">
                                        <input type="radio" name="icons" value="circle" className="form-selectgroup-input" checked={isSelected(GIT_CLONE_IMPORT_TYPE)} onChange={createHandleType(GIT_CLONE_IMPORT_TYPE)}/>
                                        <span className="form-selectgroup-label">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="me-1 icon icon-tabler icons-tabler-outline icon-tabler-brand-git"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 15v-6" /><path d="M15 11l-2 -2" /><path d="M11 7l-1.9 -1.9" /><path d="M13.446 2.6l7.955 7.954a2.045 2.045 0 0 1 0 2.892l-7.955 7.955a2.045 2.045 0 0 1 -2.892 0l-7.955 -7.955a2.045 2.045 0 0 1 0 -2.892l7.955 -7.955a2.045 2.045 0 0 1 2.892 0z" /></svg>
                                            git clone
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {
                            isSelected(UPLOAD_LOCAL_IMPORT_TYPE)
                            && <div className="col-12 mt-0">
                                    <div className="card bg-cyan-lt">
                                        <div className="card-body p-2">
                                            <label className="form-label">upload local repository</label>
                                            <input type="file" className="form-control" onChange={handleFileChange} />
                                            <small className="form-text">compressed with *.zip or *.tar.gz</small>
                                        </div>
                                    </div>
                                </div>
                        }     
                        {
                            isSelected(GITHUB_RELEASE_IMPORT_TYPE)
                            && <div className="col-12 mt-0">
                                    <div className="card bg-cyan-lt">
                                        <div className="card-body p-2">
                                            <label className="form-label">import release to github (compressed with *.zip or *.tar.gz)</label>
                                            <input type="text" className="form-control" placeholder="https://github.com/Meta-Platform/meta-platform-essential-repository/archive/refs/tags/meta-platform-essential-repository-v0.0.15.tar.gz" name="sourceCodeURL" /> 
                                        </div>
                                    </div>
                                </div>
                        }
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        onClick={handleImportRepository}
                        disabled={!readyForImport} 
                        className="btn btn-primary ms-auto" data-bs-dismiss="modal">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
                        Import Repository
                    </button>
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ImportRepositoryModal)
