import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const PROVISIONING_TYPE_SELECTION_MODE = Symbol()
const APPLICATION_SELECTION_MODE = Symbol()
const PACKAGE_SELECTION_MODE = Symbol()
const CONFIRMATION_MODE = Symbol()

const ServiceProvisioningModal = ({
    onClose,
    HTTPServerManager
}) => {

    const [ typeMode, changeTypeMode ] = useState<any>(PROVISIONING_TYPE_SELECTION_MODE)
    const [readyForProvision, setReadyForProvision] = useState(true)

    const [selectedPackageData, setSelectedPackageData] = useState(undefined)
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

    const handleProvisionService = () => {
        //setReadyForProvision(false)
        _GetServiceProvisioningManagerAPI()
        .ProvisionService({
            packageId: selectedPackageData.id
        })
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
                                    <li className={`step-item ${typeMode === CONFIRMATION_MODE ? "active": ""}`}>Confirmation</li>
                                </ul>
                            </div>
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
                        (typeMode === PACKAGE_SELECTION_MODE)
                        && <button
                                disabled={selectedPackageData === undefined}
                                className="btn btn-cyan ms-auto" onClick={() => changeTypeMode(CONFIRMATION_MODE)}>
                                Next
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
                            </button>
                    }

                    {
                        typeMode === CONFIRMATION_MODE
                        && <button
                            disabled={!readyForProvision}
                            className="btn btn-cyan ms-auto" onClick={handleProvisionService}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                            Provision service
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
