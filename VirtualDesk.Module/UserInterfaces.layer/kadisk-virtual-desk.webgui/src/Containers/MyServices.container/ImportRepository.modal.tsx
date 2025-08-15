import * as React             from "react"
import {useEffect, useState}  from "react"

const TAR_GZ_UPLOAD_IMPORT_TYPE   = Symbol("TAR_GZ_UPLOAD")
const GITHUB_RELEASE_IMPORT_TYPE = Symbol("GITHUB_RELEASE")
const GIT_CLONE_IMPORT_TYPE      = Symbol("GIT_CLONE")

const ImportRepositoryModal = ({
    onClose,
    onImport
}) => {
    
    const [ readyForImport, setReadyForCreate ] = useState(false)
    const [ formValues, setFormValues ] = useState<any>({})
    const [ recordingMode, setRecordingMode ] = useState(false)
    const [ importType,  setImportType] = useState(GIT_CLONE_IMPORT_TYPE)
    const [ repositoryFileForUpload, setRepositoryFileForUpload ] = useState()
    
    useEffect(() => {
        if(formValuesIsValid()){
            setReadyForCreate(true)
        }
    }, [formValues])

    const formValuesIsValid = () => {
        const nTotal = Object.keys(formValues).length
        if(nTotal > 0){
            const nValidItem =  Object.values(formValues).filter((values) => values && values != "").length
            const isNValidItem = nValidItem === Object.keys(formValues).length

            const isFormContentValid =
                (importType === TAR_GZ_UPLOAD_IMPORT_TYPE && repositoryFileForUpload)
                || (importType === GITHUB_RELEASE_IMPORT_TYPE && formValues.sourceCodeURL)
                || (importType === GIT_CLONE_IMPORT_TYPE && formValues.repositoryGitUrl && formValues.personalAccessToken)  


            return isNValidItem && isFormContentValid
        }
        return false
    }

    const handleChangeForm = (event) => {
        const { name, value } = event.target
        setFormValues(prevValues => ({ ...prevValues, [name]: value }))
    }

    const handleImportRepository = () => {
        setRecordingMode(true)
        
        const {
            repositoryNamespace
        } = formValues

        const importDataChunk ={
            importType: importType.description,
            repositoryNamespace
        }

        if(importType === GITHUB_RELEASE_IMPORT_TYPE){
            onImport({
                ...importDataChunk,
                sourceCodeURL: formValues.sourceCodeURL
            })
        } else if(importType === TAR_GZ_UPLOAD_IMPORT_TYPE){
            onImport({
                ...importDataChunk,
                repositoryFile: repositoryFileForUpload
            })
        } else if(importType === GIT_CLONE_IMPORT_TYPE){
            onImport({
                ...importDataChunk,
                repositoryGitUrl: formValues.repositoryGitUrl,
                personalAccessToken: formValues.personalAccessToken
            })
        }
    }

    const createHandleType    = (_importType) => () => setImportType(_importType)
    const isSelected          = (_importType) => importType === _importType

    const handleFileChangeForUploadForUpload = (event) => setRepositoryFileForUpload(event.target.files[0])
    //const handleURLChangeForImport = (event) => setURLForImport(event.target.value)
    //const handlePATChangeForImport = (event) => setPATForImport(event.target.value)

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
                                                    <input type="text" className="form-control" name="repositoryGitUrl"/>
                                                    <label>Repository URL</label>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" name="personalAccessToken"/>
                                                    <label>Personal Access Token (PAT)</label>
                                                </div>
                                            </div>
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

export default ImportRepositoryModal
