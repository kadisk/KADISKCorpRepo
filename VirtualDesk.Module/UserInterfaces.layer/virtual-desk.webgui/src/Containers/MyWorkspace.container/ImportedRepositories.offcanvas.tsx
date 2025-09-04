import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const ImportedRepositoriesOffcanvas = ({
    namespaceId,
    namespace,
    onClose,
    HTTPServerManager,
}) => {

    const [ repositories, setRepositories ] = useState<any>([])

    useEffect(() => {
        fetchImportedRepositoriesData()
    }, [namespaceId])


    const getMyServicesManagerAPI = () =>
		GetAPI({
			apiName: "MyWorkspace",
			serverManagerInformation: HTTPServerManager
		})



	const fetchImportedRepositoriesData = async () => {
        setRepositories([])
		const api = getMyServicesManagerAPI()
		const response = await api.ListRepositories({ namespaceId })
        setRepositories(response.data)
	}


    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col">
                            <h2 className="page-title">{namespace}</h2>
                        </div>
                        </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onClose()}></button>
                </div>
                <div className="offcanvas-body">
                    <div className="table-responsive bg-gray-100">
                        <table className="table table-vcenter card-table">
                            <thead>
                                <tr>
                                    <th className="p-1" >imported at</th>
                                    <th className="p-1" >source type</th>
                                    <th className="p-1" ></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    repositories
                                    .map(({
                                        id,
                                        sourceType,
                                        createdAt
                                    }) => 
                                        <tr>
                                            <td className="p-1"><strong>{createdAt}</strong></td>
                                            <td className="p-1">{sourceType}</td>
                                            <td className="p-1"><a className="btn btn-ghost-info p-1"  href={`#/my-workspace/repository-editor?repositoryId=${id}`}>Repository editor
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon ms-1 m-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                                                            </a></td>
                                        </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ImportedRepositoriesOffcanvas)