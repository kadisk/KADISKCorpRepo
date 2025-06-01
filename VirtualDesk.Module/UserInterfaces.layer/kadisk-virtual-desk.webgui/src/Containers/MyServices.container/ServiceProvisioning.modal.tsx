import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Ajv from "ajv"

import GetAPI from "../../Utils/GetAPI"

const SERVICE_SETUP_MODE = Symbol() 
const SELECT_PACKAGE_MODE = Symbol()
const PACKAGE_SETUP_MODE = Symbol()
const PROVISIONING_SERVICE_MODE = Symbol()
const PROVISIONING_COMPLETION_MODE = Symbol()
const PROVISIONING_ERROR_MODE = Symbol()

const ServiceProvisioningModal = ({
    onClose,
    HTTPServerManager
}) => {

    const [ typeMode, changeTypeMode ] = useState<any>(SERVICE_SETUP_MODE)
    const [selectedPackageData, setSelectedPackageData] = useState(undefined)
    const [packageList, setPackageList] = useState([])

    const [ serviceName, setServiceName ] = useState<string>("")
    const [ serviceDescription, setServiceDescription ] = useState<string>("")
    
    const [ startupParamsData, setStartupParamsData ] = useState<any>(undefined)

    const [startupParams, setStartupParams] = useState<any>({})

    const ajv = new Ajv()
    const [isStartupParamsValid, setIsStartupParamsValid] = useState(false)

    useEffect(() => {
        if (typeMode === PACKAGE_SETUP_MODE && startupParamsData?.schema) {
            try {
                const validate = ajv.compile(startupParamsData.schema)
                const valid = validate(startupParams)
                setIsStartupParamsValid(Boolean(valid))
            } catch {
                setIsStartupParamsValid(false)
            }
        }
    }, [startupParams, startupParamsData, typeMode])

    useEffect(() => {
        if (startupParamsData?.value) {
            setStartupParams(startupParamsData.value)
        }
    }, [startupParamsData])

    const handleStartupParamChange = (key: string, value: any) => {
        setStartupParams((prev: any) => ({
            ...prev,
            [key]: value
        }))
    }

    const renderStartupParamField = (key: string, schema: any, value: any) => {
        const type = schema.type
        if (type === "boolean") {
            return (
                <div key={key}>
                    <label className="form-label">{key}</label>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={!!value}
                        onChange={e => handleStartupParamChange(key, e.target.checked)}
                    />
                </div>
            )
        }
        if (type === "string" && schema.format === "uri") {
            return (
                <div key={key}>
                    <label className="form-label">{key}</label>
                    <input
                        type="url"
                        className="form-control"
                        value={value || ""}
                        onChange={e => handleStartupParamChange(key, e.target.value)}
                    />
                </div>
            )
        }
        return (
            <div key={key}>
                <label className="form-label">{key}</label>
                <input
                    type="text"
                    className="form-control"
                    value={value || ""}
                    onChange={e => handleStartupParamChange(key, e.target.value)}
                />
            </div>
        )
    }

    useEffect(() => {
        
        if( typeMode === SELECT_PACKAGE_MODE ){
            FetchBootablePackages()
        } else if( typeMode === PACKAGE_SETUP_MODE ){
            FetchStartupParamsData()
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

    const FetchStartupParamsData = async () => {
        const response = await _GetServiceProvisioningManagerAPI()
            .GetStartupParamsData({
                packageId: selectedPackageData?.id
            })
        
        setStartupParamsData(response.data)
    }   


    const handlePackageSelection = (packageData) => setSelectedPackageData(packageData)
    

    const handleProvision = async () => {
        changeTypeMode(PROVISIONING_SERVICE_MODE)
        const { ProvisionService } = _GetServiceProvisioningManagerAPI()
        
        try{
            await ProvisionService({
                packageId: selectedPackageData.id,
                serviceName,
                serviceDescription,
                startupParams
            })
            changeTypeMode(PROVISIONING_COMPLETION_MODE)
        } catch(error) {
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
                                    <li className={`step-item ${typeMode === SERVICE_SETUP_MODE  ? "active": ""}`}>Service setup</li>
                                    <li className={`step-item ${typeMode === SELECT_PACKAGE_MODE ? "active": ""}`}>Select package</li>
                                    <li className={`step-item ${typeMode === PACKAGE_SETUP_MODE ? "active": ""}`}>Package setup</li>
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
                                (typeMode === SELECT_PACKAGE_MODE)
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
                                (typeMode === SERVICE_SETUP_MODE)
                                    && <div className="card-body bg-cyan-lt text-cyan-lt-fg">
                                            <h3 className="card-title">Service Setup</h3>
                                            <form>
                                                <div className="space-y">
                                                    <div>
                                                        <label className="form-label"> Service name </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter service name"
                                                            className="form-control"
                                                            value={serviceName || ""}
                                                            onChange={e => setServiceName(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="form-label">Description </label>
                                                        <textarea
                                                            placeholder="What does this service do? Describe it here."
                                                            className="form-control"
                                                            value={serviceDescription || ""}
                                                            onChange={e => setServiceDescription(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </form>
                                    </div>
                            }

                            {
                                (typeMode === PACKAGE_SETUP_MODE && startupParamsData?.schema)
                                    && <div className="card-body bg-blue-lt text-blue-lt-fg">
                                            <h3 className="card-title">Package Setup - <strong>startup parameters</strong></h3>
                                            <form>
                                                <div className="space-y">
                                                    {
                                                        Object.entries(startupParamsData.schema.properties || {})
                                                        .map(([key, propSchema]: [string, any]) => renderStartupParamField(key, propSchema, startupParams?.[key]))
                                                    }
                                                </div>
                                            </form>
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
                        (typeMode === SERVICE_SETUP_MODE)
                        && <button
                                disabled={!serviceName.trim() || !serviceDescription.trim()}
                                className="btn btn-cyan ms-auto" onClick={() => changeTypeMode(SELECT_PACKAGE_MODE)}>
                                Select package
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
                            </button>
                    }
                    {
                        (typeMode === SELECT_PACKAGE_MODE)
                        && <button
                                disabled={!selectedPackageData}
                                className="btn btn-cyan ms-auto" onClick={() => changeTypeMode(PACKAGE_SETUP_MODE)}>
                                Package setup
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
                            </button>
                    }
                    {
                        typeMode === PACKAGE_SETUP_MODE
                        && <button
                                disabled={!isStartupParamsValid}
                                className="btn btn-cyan ms-auto" onClick={handleProvision}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                                Provision
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
