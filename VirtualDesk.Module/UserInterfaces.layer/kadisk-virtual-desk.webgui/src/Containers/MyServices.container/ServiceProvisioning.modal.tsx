import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const PROVISIONING_TYPE_SELECTION_MODE = Symbol()
const APPLICATION_SELECTION_MODE = Symbol()
const PACKAGE_SELECTION_MODE = Symbol()
const PACKAGE_CONFIRMATION_MODE = Symbol()
const APPLICATION_CONFIRMATION_MODE = Symbol()
const PROVISIONING_SERVICE_MODE = Symbol()
const PROVISIONING_ERROR_MODE = Symbol()
const PROVISIONING_COMPLETION_MODE = Symbol()

//provisioning service
const ServiceProvisioningModal = ({
    onClose,
    HTTPServerManager
}) => {

    const [ typeMode, changeTypeMode ] = useState<any>(PROVISIONING_TYPE_SELECTION_MODE)
    const [readyForProvision, setReadyForProvision] = useState(true)

    const [selectedPackageData, setSelectedPackageData] = useState(undefined)
    const [selectedApplicationData, setSelectedApplicationData] = useState(undefined)
    const [provisioningType, setProvisioningType] = useState<any>(undefined)
    
    const [packageList, setPackageList] = useState([])
    const [applicationList, setApplicationList] = useState([])

    useEffect(() => {
        
        if( typeMode === PACKAGE_SELECTION_MODE ){
            FetchBootablePackages()
        } else if( typeMode === APPLICATION_SELECTION_MODE ){
            FetchApplications()
        }

    }, [typeMode])


    const _GetServiceProvisioningManagerAPI = () =>
        GetAPI({
            apiName: "ServiceProvisioning",
            serverManagerInformation: HTTPServerManager
        })

    const FetchBootablePackages = async () => {
        const response = await _GetServiceProvisioningManagerAPI()
            .ListBootablePackages()
        setPackageList(response.data)
    }

    const FetchApplications = async () => {
        const response = await _GetServiceProvisioningManagerAPI()
        .ListApplications()
        setApplicationList(response.data)
    }

    const handlePackageSelection = (packageData) => setSelectedPackageData(packageData)
    const handleApplicationSelection = (applicationData) => setSelectedApplicationData(applicationData)

    const handleProvisionServiceFromPackage = () => {
        //setReadyForProvision(false)
        _GetServiceProvisioningManagerAPI()
        .ProvisionServiceFromPackage({
            packageId: selectedPackageData.id
        })
    }

    const handleProvisionServiceFromApplication = async () => {
        changeTypeMode(PROVISIONING_SERVICE_MODE)

        const { ProvisionServiceFromApplication } = _GetServiceProvisioningManagerAPI()

        try{
            await ProvisionServiceFromApplication({
                packagePath: selectedApplicationData.package,
                repositoryId: selectedApplicationData.repositoryId,
                executableName: selectedApplicationData.executableName,
                appType: selectedApplicationData.type
            })

            changeTypeMode(PROVISIONING_COMPLETION_MODE)
        } catch(error){
            console.log(error)
            changeTypeMode(PROVISIONING_ERROR_MODE)
        }
        
    }
    
    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Service Provisioning</h5>
                    <button type="button" className="btn-close" onClick={onClose} />
                </div>
                <div className="modal-body">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <ul className="steps steps-cyan my-4">
                                    <li className={`step-item ${typeMode === PROVISIONING_TYPE_SELECTION_MODE ? "active": ""}`}>Provisioning Type</li>
                                    <li className={`step-item ${typeMode === PACKAGE_SELECTION_MODE || typeMode === APPLICATION_SELECTION_MODE ? "active": ""}`}>Selection</li>
                                    <li className={`step-item ${typeMode === PACKAGE_CONFIRMATION_MODE ||  typeMode === APPLICATION_CONFIRMATION_MODE  ? "active": ""}`}>Confirmation</li>
                                    <li className={`step-item ${typeMode === PROVISIONING_SERVICE_MODE  ? "active": ""}`}>Provisioning</li>
                                    <li className={`step-item ${typeMode === PROVISIONING_COMPLETION_MODE  ? "active": ""}`}>Completion</li>
                                </ul>
                            </div>
                            
                            {
                                (typeMode === PROVISIONING_SERVICE_MODE)
                                && <div className="card-body">
                                        <div className="text-center">
                                            <div className="text-secondary mb-3">working on provisioning...</div>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar progress-bar-indeterminate"></div>
                                            </div>
                                        </div>
                                    </div>

                            }
                            {
                                (typeMode === PROVISIONING_TYPE_SELECTION_MODE)
                                && <div className="card-body">
                                        <div>
                                            <div className="list-group list-group-flush list-group-hoverable">
                                                <div className={`list-group-item`}>
                                                    <div className="row align-items-center">
                                                        <div className="col-auto">
                                                            <input 
                                                                className="form-check-input" 
                                                                type="radio" 
                                                                name="radios-package"
                                                                onChange={() => setProvisioningType(APPLICATION_SELECTION_MODE)}/>
                                                        </div>
                                                        <div className="col text-truncate">
                                                            <a className="text-reset d-block">Application</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`list-group-item`}>
                                                    <div className="row align-items-center">
                                                        <div className="col-auto">
                                                            <input 
                                                                className="form-check-input" 
                                                                type="radio" 
                                                                name="radios-package"
                                                                onChange={() => setProvisioningType(PACKAGE_SELECTION_MODE)}/>
                                                        </div>
                                                        <div className="col text-truncate">
                                                            <a className="text-reset d-block">Package</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                            {
                                (typeMode === APPLICATION_SELECTION_MODE)
                                && <div className="card-body">
                                        <div>
                                            <div className="list-group list-group-flush list-group-hoverable">
                                                {
                                                    applicationList.map((app) => 
                                                        <div className={`list-group-item ${selectedApplicationData?.executableName === app.executableName ? "active": ""}`}>
                                                            <div className="row align-items-center">
                                                                <div className="col-auto">
                                                                    <input 
                                                                        className="form-check-input" 
                                                                        type="radio" 
                                                                        name="radios-package" 
                                                                        value={app.executableName}
                                                                        checked={selectedApplicationData?.executableName === app.executableName}
                                                                        onChange={() => handleApplicationSelection(app)}
                                                                    />
                                                                </div>
                                                                <div className="col text-truncate">
                                                                    <a className="text-reset d-block"><strong>{app.executableName}</strong> {app.type}</a>
                                                                    <div className="d-block text-secondary text-truncate mt-n1"><strong>{app.repositoryNamespace}</strong>/{app.package}</div>
                                                                </div>
                                                            </div>
                                                        </div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                            }
                            {
                                (typeMode === PACKAGE_SELECTION_MODE)
                                && <div className="card-body">
                                        <div>
                                            <div className="list-group list-group-flush list-group-hoverable">
                                                {
                                                    packageList.map((pkg) => 
                                                        <div className={`list-group-item ${selectedPackageData?.id === pkg.id ? "active": ""}`}>
                                                            <div className="row align-items-center">
                                                                <div className="col-auto">
                                                                    <input 
                                                                        className="form-check-input" 
                                                                        type="radio" 
                                                                        name="radios-package" 
                                                                        value={pkg.id}
                                                                        checked={selectedPackageData?.id === pkg.id}
                                                                        onChange={() => handlePackageSelection(pkg)}
                                                                    />
                                                                </div>
                                                                <div className="col text-truncate">
                                                                    <a className="text-reset d-block"><strong>{pkg.itemName}</strong>.{pkg.itemType}</a>
                                                                    <div className="d-block text-secondary text-truncate mt-n1"><strong>{pkg["Repository.namespace"]}</strong></div>
                                                                </div>
                                                            </div>
                                                        </div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                            }
                            {
                                typeMode === APPLICATION_CONFIRMATION_MODE  
                                && <div className="card-body">
                                        <dl className="row">
                                            <dt className="col-5">Executable Name</dt>
                                            <dd className="col-7">{selectedApplicationData?.executableName}</dd>
                                            <dt className="col-5">Package</dt>
                                            <dd className="col-7">{selectedApplicationData?.package}</dd>
                                            <dt className="col-5">Repository Namespace</dt>
                                            <dd className="col-7">{selectedApplicationData?.repositoryNamespace}</dd>
                                            <dt className="col-5">Type</dt>
                                            <dd className="col-7">{selectedApplicationData?.type}</dd>
                                        </dl>
                                    </div>
                            }
                            
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>

                    {
                        (typeMode === PROVISIONING_TYPE_SELECTION_MODE)
                        && <button
                                disabled={provisioningType === undefined}
                                onClick={() => changeTypeMode(provisioningType)}
                                className="btn btn-cyan ms-auto">
                                Next
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
                            </button>
                    }

                    {
                        (typeMode === APPLICATION_SELECTION_MODE)
                        && <button
                                disabled={selectedApplicationData === undefined}
                                className="btn btn-cyan ms-auto" onClick={() => changeTypeMode(APPLICATION_CONFIRMATION_MODE)}>
                                Next
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
                            </button>
                    }
                    {
                        (typeMode === PACKAGE_SELECTION_MODE)
                        && <button
                                disabled={selectedPackageData === undefined}
                                className="btn btn-cyan ms-auto" onClick={() => changeTypeMode(PACKAGE_CONFIRMATION_MODE)}>
                                Next
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
                            </button>
                    }
                    {
                        typeMode === APPLICATION_CONFIRMATION_MODE
                        && <button
                                disabled={!readyForProvision}
                                className="btn btn-cyan ms-auto" onClick={handleProvisionServiceFromApplication}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                                Provision from Application
                            </button>
                    }
                    {
                        typeMode === PACKAGE_CONFIRMATION_MODE
                        && <button
                                disabled={!readyForProvision}
                                className="btn btn-cyan ms-auto" onClick={handleProvisionServiceFromPackage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                                Provision from Package
                            </button>
                    }
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceProvisioningModal)
