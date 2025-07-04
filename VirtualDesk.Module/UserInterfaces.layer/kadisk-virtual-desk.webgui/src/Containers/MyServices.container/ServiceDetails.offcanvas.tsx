import * as React             from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

const ServiceDetailsOffcanvas = ({
    HTTPServerManager
}) => {
    return <div className="offcanvas offcanvas-end show" data-bs-backdrop="false">
                <div className="offcanvas-body">
                    Content for the offcanvas goes here. You can place just about any Tabler
                    component or custom
                    elements here.
                </div>
            </div>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetailsOffcanvas)