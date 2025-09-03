import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const CreateNewUserModal = ({
    onClose,
    onSave,
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


    const _GetUserManagementAPI = () => 
        GetAPI({ 
            apiName:"UserManagement",  
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

    const createNewUser = async() => {
        setRecordingMode(true)
        const api = _GetUserManagementAPI()
        await api.CreateNewUser(formValues)
        onSave()
    }

    const handleChangeForm = () => setFormValues(getValues())

    const handleCreateNewUser = () => createNewUser()

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">New user</h5>
                    <button type="button" className="btn-close" onClick={onClose}/>
                </div>
                <div className="modal-body">
                    <form className="row row-cards" onChange={() => handleChangeForm()}>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <Controller
                                                name={"name"}
                                                control={control}
                                                render={({ field }) => <input disabled={recordingMode} type="text" className="form-control" placeholder="Name" {...field}/>} /> 
                                
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <Controller
                                                name={"email"}
                                                control={control}
                                                render={({ field }) => <input disabled={recordingMode} type="text" className="form-control" placeholder="Email" {...field}/>} />
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <Controller
                                                name={"username"}
                                                control={control}
                                                render={({ field }) => <input disabled={recordingMode} type="text" className="form-control" placeholder="Username" {...field}/>}/>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <Controller
                                                name={"password"}
                                                control={control}
                                                render={({ field }) => <input disabled={recordingMode} type="password" className="form-control" placeholder="Password" {...field}/>}/>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateNewUser}
                        disabled={!readyForCreate || recordingMode} 
                        className="btn btn-primary ms-auto" data-bs-dismiss="modal">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 5l0 14" />
                            <path d="M5 12l14 0" />
                        </svg>
                        Create new user
                    </button>
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewUserModal)
