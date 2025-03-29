import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const ServiceProvisioningModal = ({
    onClose,
    HTTPServerManager
}) => {

    const [readyForProvision, setReadyForProvision] = useState(false)

    useEffect(() => {
        FetchBootablePackages()
    }, [])

    const _GetServiceProvisioningManagerAPI = () => 
        GetAPI({ 
            apiName:"ServiceProvisioning",  
            serverManagerInformation: HTTPServerManager
        })

    const FetchBootablePackages = async () => {
        const response = await _GetServiceProvisioningManagerAPI()
        .ListBootablePackages()
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
                            <div className="table-responsive">
                                <table className="table table-vcenter card-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Title</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th className="w-1"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Paweł Kuna</td>
                                            <td className="text-secondary">UI Designer, Training</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">paweluna@howstuffworks.com</a></td>
                                            <td className="text-secondary">User</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jeffie Lewzey</td>
                                            <td className="text-secondary">Chemical Engineer, Support</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">jlewzey1@seesaa.net</a></td>
                                            <td className="text-secondary">User</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Mallory Hulme</td>
                                            <td className="text-secondary">Geologist IV, Support</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">mhulme2@domainmarket.com</a></td>
                                            <td className="text-secondary">User</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Dunn Slane</td>
                                            <td className="text-secondary">Research Nurse, Sales</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">dslane3@epa.gov</a></td>
                                            <td className="text-secondary">Owner</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Emmy Levet</td>
                                            <td className="text-secondary">VP Product Management, Accounting</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">elevet4@senate.gov</a></td>
                                            <td className="text-secondary">User</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Maryjo Lebarree</td>
                                            <td className="text-secondary">Civil Engineer, Product Management</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">mlebarree5@unc.edu</a></td>
                                            <td className="text-secondary">User</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Egan Poetz</td>
                                            <td className="text-secondary">Research Nurse, Engineering</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">epoetz6@free.fr</a></td>
                                            <td className="text-secondary">Admin</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kellie Skingley</td>
                                            <td className="text-secondary">Teacher, Services</td>
                                            <td className="text-secondary"><a href="#" className="text-reset">kskingley7@columbia.edu</a></td>
                                            <td className="text-secondary">Owner</td>
                                            <td>
                                                <a href="#">Edit</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        disabled={!readyForProvision}
                        className="btn btn-cyan ms-auto" data-bs-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                        Provision service
                    </button>
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceProvisioningModal)
