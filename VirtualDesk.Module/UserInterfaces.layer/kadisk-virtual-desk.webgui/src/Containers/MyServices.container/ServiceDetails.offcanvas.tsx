import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const GetColor = (status: string) => {
    switch (status) {
        case "RUNNING":
            return "green"
        case "STARTING":
            return "cyan"
        case "FAILURE":
            return "red"
        case "TERMINATED":
        case "STOPPED":
        case "LOADED":
            return "yellow"
        default:
            return "orange"
    }
}

const ServiceDetailsOffcanvas = ({
    serviceId,
    onCloseServiceDetails,
    HTTPServerManager,
}) => {

    const [ serviceData, setServiceData ] = useState<any>()
    const [ status, setStatus ] = useState("PENDING")

    useEffect(() => {
        fetchServiceData()
        fetchStatus()
    }, [])


    const getMyServicesManagerAPI = () =>
		GetAPI({
			apiName: "MyServicesManager",
			serverManagerInformation: HTTPServerManager
		})

        
    const fetchStatus = async () => {
		const api = getMyServicesManagerAPI()
		const response = await api.GetServiceStatus({ serviceId })
        setStatus(response.data)
	}

	const fetchServiceData = async () => {
		const api = getMyServicesManagerAPI()
		const response = await api.GetServiceData({ serviceId })
        setServiceData(response.data)
	}

    return <div className="offcanvas offcanvas-end show" data-bs-backdrop="false" style={{"width":"500px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <span className={`status-indicator status-${GetColor(status)} status-indicator-animated`}>
                            <span className="status-indicator-circle"></span>
                            <span className="status-indicator-circle"></span>
                            <span className="status-indicator-circle"></span>
                            </span>
                        </div>
                        <div className="col">
                            <h2 className="page-title">{serviceData?.serviceName}</h2>
                            <div className="text-secondary">
                            <ul className="list-inline list-inline-dots mb-0">
                                <li className="list-inline-item"><span className={`text-${GetColor(status)}`}>{status}</span></li>
                                
                            </ul>
                            </div>
                        </div>
                        </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onCloseServiceDetails()}></button>
                </div>
                <div className="offcanvas-body">
                    <p>{serviceData?.serviceDescription}</p>
                    <div className="hr-text hr-text-center hr-text-spaceless my-3">General information</div>
                    <dl className="row">
                        <dt className="col-5">package:</dt>
                        <dd className="col-7">{serviceData?.packageName}</dd>
                        <dt className="col-5">type:</dt>
                        <dd className="col-7">{serviceData?.packageType}</dd>
                        <dt className="col-5">repository namespace:</dt>
                        <dd className="col-7">{serviceData?.repositoryNamespace}</dd>
                    </dl>
                </div>
            </div>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetailsOffcanvas)