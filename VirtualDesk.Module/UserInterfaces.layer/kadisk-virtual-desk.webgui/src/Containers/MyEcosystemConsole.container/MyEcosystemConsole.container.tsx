import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const ECOSYSTEM_ACTIVATING_MODE = Symbol()
const FIRST_USE_MODE = Symbol()
const DEFAULT_MODE = Symbol()

const MyEcosystemConsoleContainer = ({HTTPServerManager}) => {

    const [ ecosystemConsoleModeType,  setEcosystemConsoleModeType] = useState<any>(FIRST_USE_MODE)
    
    const GetMyEcosystemConsoleAPI = () =>
        GetAPI({
            apiName: "MyEcosystemConsole",
            serverManagerInformation: HTTPServerManager
        })

    const ActivateMyEcosystemInstance = async () => {
        setEcosystemConsoleModeType(ECOSYSTEM_ACTIVATING_MODE)
        const response = await GetMyEcosystemConsoleAPI().ActivateMyEcosystemInstance()
        setEcosystemConsoleModeType(DEFAULT_MODE)
    }



	return <div className="page-body d-flex flex-column justify-content-center align-items-center text-center py-5">
                <div className="container-xl">
                    <div className="empty">
                        <h1 className="empty-title">Execution environment not activated</h1>
                        <p className="empty-subtitle text-secondary">
                            Before using the applications, you need to activate the ecosystem for the first time. Once activated, you will be able to use and configure it as needed.
                        </p>
                        <div className="empty-action d-flex gap-3">
                            <button className={`btn btn-primary ${ecosystemConsoleModeType === ECOSYSTEM_ACTIVATING_MODE ? "btn-loading" : ""}`} onClick={() => ActivateMyEcosystemInstance()}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-sandbox"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.953 8.017l1.047 6.983v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2l1.245 -8.297a2 2 0 0 1 1.977 -1.703h3.778" /><path d="M3 15h18" /><path d="M13 3l5.5 1.5" /><path d="M15.75 3.75l-2 7" /><path d="M7 10.5c1.667 -.667 3.333 -.667 5 0c1.667 .667 3.333 .667 5 0" /></svg>
                                Activate My Ecosystem Instance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
}


const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(MyEcosystemConsoleContainer)
