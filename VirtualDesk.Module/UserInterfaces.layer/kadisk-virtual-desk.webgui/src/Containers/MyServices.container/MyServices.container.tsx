import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import WelcomeMyServices from "./WelcomeMyServices"
import ImportRepositoryModal from "./ImportRepository.modal"
import ServiceProvisioningModal from "./ServiceProvisioning.modal"
import RepositoriesManagerModal from "./RepositoriesManager.modal"
import ImportingModal from "./Importing.modal"

const DEFAULT_MODE              = Symbol()
const IMPORT_SELECT_MODE        = Symbol()
const IMPORTING_MODE            = Symbol()
const NO_REPOSITORIES_MODE      = Symbol()
const LOADING_MODE              = Symbol()
const SERVICE_PROVISIONING_MODE = Symbol()
const REPOSITORIES_MANAGER_MODE = Symbol()


const START_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
const RESTART_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
const STOP_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>
const SETTINGS_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12a9 9 0 1 0 -8.979 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a16.992 16.992 0 0 1 2.522 10.376" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>

const GetSatatusBadgeClasses = (status: string) => {
    switch (status) {
        case "running":
            return "badge bg-green-lt text-green"
        case "exited":
            return "badge bg-red-lt text-red"
        default:
            return "badge bg-orange-lt text-orange"
    }
}

const MyServicesContainer = ({
    HTTPServerManager
}) => {

    const [ importDataCurrent, setImportDataCurrent ] = useState<{repositoryNamespace:string, sourceCodeURL:string}>()
    const [ interfaceModeType,  changeMode] = useState<any>(LOADING_MODE)
    const [ provisionedServicesList, setProvisionedServicesList ] = useState([])

    useEffect(() => {

        if(interfaceModeType === LOADING_MODE){
            fetchMyServicesStatus()
        } else if(interfaceModeType === DEFAULT_MODE){
            fetchProvisionedServices()
        }

    }, [interfaceModeType])
    
    const getMyServicesManagerAPI = () => 
        GetAPI({ 
            apiName:"MyServicesManager",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchMyServicesStatus = async () => {
        const api = getMyServicesManagerAPI()
        const response = await api.GetMyServicesStatus()
        if(response.data === "READY"){
            changeMode(DEFAULT_MODE)
        } else if (response.data === "NO_REPOSITORIES"){
            changeMode(NO_REPOSITORIES_MODE)
        }
    }

    const fetchProvisionedServices = async () => {
        const api = getMyServicesManagerAPI()
        const response = await api.ListProvisionedServices()
        setProvisionedServicesList(response.data)
    }

    const handleUseFromMyWorkspace = () => {
        console.log("== handleUseFromMyWorkspace")
    }

    const handleImportingMode = (importData) => {
        setImportDataCurrent(importData)
        changeMode(IMPORTING_MODE)
    }

    const handleFinishedImportModal = () => changeMode(LOADING_MODE)

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
                    <div className="py-4">
                        {
                            provisionedServicesList 
                            && <div className="row">
                                    {
                                        provisionedServicesList.map((provisionedService, index) => (
                                            <div key={index} className="col-md-4">
                                                <div className="card card-link mb-3">

                                                    <div className="card-header py-2">
                                                        <span className={`${GetSatatusBadgeClasses(provisionedService.containerStatus)} me-2`}>{provisionedService.containerStatus}</span>
                                                        <div>
                                                            <h4 className="card-title">{provisionedService.executableName}</h4>
                                                            <p className="card-subtitle">{provisionedService.repositoryNamespace}/{provisionedService.packageName}/{provisionedService.packageType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <dl className="row">
                                                            <dt className="col-5">IP Address</dt>
                                                            <dd className="col-7">{provisionedService.containerIPAddress}</dd>
                                                        </dl>
                                                    </div>
                                                    <div className="card-footer bg-blue-lt">
                                                        <div className="btn-list justify-content-end">
                                                            {
                                                                provisionedService.containerStatus === "exited"
                                                                && <button className="btn btn-primary" onClick={() => {}}>
                                                                        {START_ICON}start
                                                                    </button>
                                                            }
                                                            {
                                                                provisionedService.containerStatus === "running"
                                                                && <>
                                                                        <button className="btn btn-orange">
                                                                            {RESTART_ICON}restart
                                                                        </button>
                                                                        <button className="btn btn-danger" onClick={() => {}}>
                                                                            {STOP_ICON}stop
                                                                        </button>
                                                                    </>
                                                            }
                                                            <a className="btn btn-sencondary" href={`#/my-services/service-settings/${provisionedService.serviceId}`}>
                                                                {SETTINGS_ICON}settings
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))
                                    }
                                </div>
                        }
                    </div>
                </div>


                {
                    interfaceModeType === IMPORT_SELECT_MODE
                    && <ImportRepositoryModal onImport={handleImportingMode} onClose={() => changeMode(DEFAULT_MODE)} />
                }

                {
                    interfaceModeType === SERVICE_PROVISIONING_MODE
                    && <ServiceProvisioningModal onClose={() => changeMode(DEFAULT_MODE)} />
                }
                {
                    interfaceModeType === REPOSITORIES_MANAGER_MODE
                    && <RepositoriesManagerModal onImportNew={() => changeMode(IMPORT_SELECT_MODE)} onClose={() => changeMode(DEFAULT_MODE)} />
                }

                {
                   interfaceModeType === NO_REPOSITORIES_MODE
                   && <WelcomeMyServices onImportNew={() => changeMode(IMPORT_SELECT_MODE)} onUseFromMyWorkspace={handleUseFromMyWorkspace}/>
                }

                {
                    interfaceModeType === IMPORTING_MODE 
                    && <ImportingModal importData={importDataCurrent} onFinishedImport={handleFinishedImportModal}/>
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