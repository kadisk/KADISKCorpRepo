import * as React from "react"

const CreateNewUserModal = ({
    onClose
}) => {




    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">New user</h5>
                    <button type="button" className="btn-close" onClick={onClose}/>
                </div>
                <div className="modal-body">
                    <div className="row row-cards">
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" placeholder="Name" />
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" placeholder="Email" />
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-control" placeholder="Username"/>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <a href="#" className="btn btn-primary ms-auto" data-bs-dismiss="modal">
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
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 5l0 14" />
                            <path d="M5 12l14 0" />
                        </svg>
                        Create new user
                    </a>
                </div>
            </div>
        </div>
    </div>
}

export default CreateNewUserModal
