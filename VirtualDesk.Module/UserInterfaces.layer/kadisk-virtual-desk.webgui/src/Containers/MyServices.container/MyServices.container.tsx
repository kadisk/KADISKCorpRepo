import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import WelcomeMyServices from "./WelcomeMyServices"
import ImportRepositoryModal from "./ImportRepository.modal"
import ServiceProvisioningModal from "./ServiceProvisioning.modal"
import RepositoriesManagerModal from "./RepositoriesManager.modal"

const DEFAULT_MODE              = Symbol()
const IMPORT_SELECT_MODE        = Symbol()
const IMPORTING_MODE            = Symbol()
const NO_REPOSITORIES_MODE      = Symbol()
const LOADING_MODE              = Symbol()
const SERVICE_PROVISIONING_MODE = Symbol()
const REPOSITORIES_MANAGER_MODE = Symbol()

const MyServicesContainer = ({
    HTTPServerManager
}) => {

    const [ interfaceModeType,  changeMode] = useState<any>(LOADING_MODE)

    useEffect(() => {
        fetchMyServicesStatus()
    }, [])
    
    const getMyServicesManagerAPI = () => 
        GetAPI({ 
            apiName:"MyServicesManager",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchMyServicesStatus = async () => {
        const response = await getMyServicesManagerAPI().GetMyServicesStatus()
        if(response.data === "READY"){
            changeMode(DEFAULT_MODE)
        } else if (response.data === "NO_REPOSITORIES"){
            changeMode(NO_REPOSITORIES_MODE)
        }
    }

    const handleUseFromMyWorkspace = () => {
        console.log("== handleUseFromMyWorkspace")
    }

    return <>

                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <h2 className="page-title">My Services</h2>
                        </div>
                        {
                            interfaceModeType === DEFAULT_MODE
                            && <div className="col-auto ms-auto d-print-none">
                                <div className="btn-list">
                                    <span className="d-none d-sm-inline">
                                        <button className="btn btn-cyan" onClick={() => changeMode(SERVICE_PROVISIONING_MODE)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                                            Service provisioning
                                        </button>
                                    </span>
                                    <button className="btn btn-outline-cyan" onClick={() => changeMode(REPOSITORIES_MANAGER_MODE)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-folders"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M17 16v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2" /></svg>
                                        Repository manager
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>


                {
                    interfaceModeType === IMPORT_SELECT_MODE
                    && <ImportRepositoryModal onImport={() => changeMode(IMPORTING_MODE)} onClose={() => changeMode(DEFAULT_MODE)} />
                }

                {
                    interfaceModeType === SERVICE_PROVISIONING_MODE
                    && <ServiceProvisioningModal onClose={() => changeMode(DEFAULT_MODE)} />
                }
                {
                    interfaceModeType === REPOSITORIES_MANAGER_MODE
                    && <RepositoriesManagerModal onClose={() => changeMode(DEFAULT_MODE)} />
                }

                {
                   interfaceModeType === NO_REPOSITORIES_MODE
                   && <WelcomeMyServices onImportNew={() => changeMode(IMPORT_SELECT_MODE)} onUseFromMyWorkspace={handleUseFromMyWorkspace}/>
                }

                {
                    interfaceModeType === LOADING_MODE
                    && <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                }
            </>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(MyServicesContainer)