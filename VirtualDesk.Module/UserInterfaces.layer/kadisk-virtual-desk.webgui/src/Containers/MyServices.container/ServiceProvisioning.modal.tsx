import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

const ServiceProvisioningModal = ({
    onClose,
    HTTPServerManager
}) => {
    
    const [ readyForProvision, setReadyForProvision ] = useState(false)

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Service Provisioning</h5>
                    <button type="button" className="btn-close" onClick={onClose}/>
                </div>
                <div className="modal-body">
                   
                </div>

                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        disabled={!readyForProvision}
                        className="btn btn-cyan ms-auto" data-bs-dismiss="modal">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                        Provision service
                    </button>
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceProvisioningModal)
