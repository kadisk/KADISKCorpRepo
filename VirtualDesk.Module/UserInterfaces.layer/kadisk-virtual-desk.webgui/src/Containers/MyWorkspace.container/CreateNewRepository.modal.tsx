import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const CreateNewRepositoryModal = ({
    onClose,
    onCreated,
    HTTPServerManager
}) => {

    const [ readyForCreate, setReadyForCreate ] = useState(false)
    const [ formValues, setFormValues ] = useState({})
    const [ recordingMode, setRecordingMode ] = useState(false)

    const { 
        getValues, 
        reset, 
        control 
    } = useForm()


    const _GetMyWorkspaceAPI = () => 
        GetAPI({ 
            apiName:"MyWorkspace",  
            serverManagerInformation: HTTPServerManager
        })


    const formValuesIsValid = () => {
        const nTotal = Object.keys(formValues).length
        if(nTotal > 0){
            const nValidItem =  Object.values(formValues).filter((values) => values && values != "").length
            return nValidItem === Object.keys(formValues).length
        }
        return false
    }

    useEffect(() => {

        if(formValuesIsValid()){
            setReadyForCreate(true)
        }

    }, [formValues])

    const createNewRepo = async() => {
        setRecordingMode(true)
        const api = _GetMyWorkspaceAPI()
        await api.CreateNewRepository(formValues)
        onCreated()
    }

    const handleChangeForm = () => setFormValues(getValues())

    const handleCreateNewRepo = () => createNewRepo()

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">New Repository</h5>
                    <button type="button" className="btn-close" onClick={onClose}/>
                </div>
                <div className="modal-body">
                    <form className="row row-cards" onChange={() => handleChangeForm()}>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Repository Namespace</label>
                                <Controller
                                                name={"repositoryNamespace"}
                                                control={control}
                                                render={({ field }) => <input disabled={recordingMode} type="text" className="form-control" placeholder="Repository Namespace" {...field}/>} /> 
                                
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateNewRepo}
                        disabled={!readyForCreate || recordingMode} 
                        className="btn btn-primary ms-auto" data-bs-dismiss="modal">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                        Create repository
                    </button>
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewRepositoryModal)
