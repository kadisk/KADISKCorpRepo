import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

const DefaultParametersContainer = ({ HTTPServerManager }) => {

    const [ defaultParametersCurrent, setDefaultParametersCurrent ] = useState<any>()

    useEffect(() => {
        fetchDefaultParameters()
    }, [])

    const getDefaultParametersAPI = () => 
        GetAPI({ 
            apiName:"DefaultParameters",  
            serverManagerInformation: HTTPServerManager
        })
    
    const fetchDefaultParameters = async () => {
        setDefaultParametersCurrent(undefined)
        const api = getDefaultParametersAPI()
        const response = await api.GetDefaultParamaters()
        setDefaultParametersCurrent(response.data)
    }

    return <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            { 
                                defaultParametersCurrent
                                && <div className="table-responsive">
                                        <table className="table table-vcenter table-mobile-md card-table">
                                            <tbody>
                                                {
                                                    Object.keys(defaultParametersCurrent)
                                                        .map((parameterName) => <tr>
                                                            <td>
                                                                <div className="text-secondary">{parameterName}</div>
                                                                <div><h4>{defaultParametersCurrent[parameterName]}</h4></div>
                                                            </td>
                                                            <td className="text-end">
                                                                <button className="btn">
                                                                    Edit
                                                                </button>
                                                            </td>
                                                        </tr>)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(DefaultParametersContainer)
