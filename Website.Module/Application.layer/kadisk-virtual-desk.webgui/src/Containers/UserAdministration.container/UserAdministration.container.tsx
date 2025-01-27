import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import CreateNewUserModal from "./CreateNewUser.modal"
import UserTableTable from "./User.table"

import GetAPI from "../../Utils/GetAPI"

const PlusIconSVG = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-2"><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg>

const UserAdministrationContainer = ({HTTPServerManager}) => {

    const [ newUserMode, setNewUserMode ] = useState(false)
    const [ userList, setUserList ] = useState()

    const ativeCreateUserMode = () => setNewUserMode(true)
    const closeModal = () => setNewUserMode(false)

    const handleOpenModalNewUser = () => ativeCreateUserMode()
    const handleCloseModalNewUser = () => closeModal()

    useEffect(() => {
        fetchUserList()
    }, [])

    const _GetUserManagementAPI = () => 
        GetAPI({ 
            apiName:"UserManagement",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchUserList = async () => {
        setUserList(undefined)
        const api = _GetUserManagementAPI()
        const response = await api.ListUsers()
        setUserList(response.data)
    }

    const handleSaveUser = () => {
        closeModal()
        fetchUserList()
    }

    return (
        <>
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <h2 className="page-title">
                                User administration
                            </h2>
                        </div>
                        <div className="col-auto ms-auto d-print-none">
                            <div className="d-flex">
                                <button className="btn btn-primary btn-3" onClick={handleOpenModalNewUser}>
                                    <PlusIconSVG/>
                                    New user
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="col-lg-12">
                        <div className="card">
                            <UserTableTable users={userList}/>
                        </div>
                    </div>
                </div>
            </div>
            {
                newUserMode
                && <CreateNewUserModal
                        onSave={handleSaveUser}
                        onClose={handleCloseModalNewUser}/>
            }
        </>
    )
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(UserAdministrationContainer)