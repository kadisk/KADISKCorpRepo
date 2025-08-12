import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const DEFAULT_MODE = Symbol()
const REPOSITORY_MANAGER_MODE = Symbol()

const NamespaceAndRepositoryManagerModal = ({
    onClose,
    onImportNew,
    HTTPServerManager
}) => {

    const [ mode, setMode ] = useState<any>(DEFAULT_MODE)
    const [ repositories, setRepositories ] = useState([])
    const [ namespaceIdSelected, setNamespaceIdSelected ] = useState(undefined)
    const [ namespaceSelected, setNamespaceSelected ] = useState(undefined)

    useEffect(() => {
        FetchRepositories()
    }, [])

    const _GetRepositoryServiceManager = () =>
        GetAPI({
            apiName: "RepositoryServiceManager",
            serverManagerInformation: HTTPServerManager
        })

    const FetchRepositories = async () => {
        const api = _GetRepositoryServiceManager()
        const response = await api.ListRepositories()
        setRepositories(response.data)
    }

    const ActiveManagerRepositoriesMode = (id, namespace) => {
        setMode(REPOSITORY_MANAGER_MODE)
        setNamespaceIdSelected(id)
        setNamespaceSelected(namespace)
    }

    const ActiveDefaultMode = () => {
        setMode(DEFAULT_MODE)
        setNamespaceIdSelected(undefined)
        setNamespaceSelected(undefined)
    }

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Namespace and repository manager</h5>
                    <button type="button" className="btn-close" onClick={onClose}/>
                </div>
                {
                    mode === REPOSITORY_MANAGER_MODE
                    && namespaceSelected
                    && <div className="modal-body">
                            <ol className="breadcrumb breadcrumb-muted" aria-label="breadcrumbs">
                                <li className="breadcrumb-item">
                                    <a className="cursor-pointer" onClick={() => ActiveDefaultMode()}>Manager</a>    
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    <a href="#">{namespaceSelected}</a>
                                </li>
                            </ol>
                        </div>
                }
                {
                    mode === DEFAULT_MODE
                    && <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-vcenter card-table table-striped">
                                <thead>
                                    <tr>
                                    <th>ID</th>
                                    <th>Namespace</th>
                                    <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        repositories
                                        .map(({id, namespace}) => <tr>
                                                                        <td className="text-secondary">{id}</td>
                                                                        <td className="text-secondary">{namespace}</td>
                                                                        <td>
                                                                            <div className="btn-list flex-nowrap">
                                                                                <button className="btn btn-1" onClick={() => ActiveManagerRepositoriesMode(id, namespace)}>manage</button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>)
                                    }
                                </tbody>
                                </table>
                            </div>
                        </div>
                }
                <div className="modal-footer">
                    <button className="btn btn-link link-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-cyan" onClick={onImportNew}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
                        Import new repository
                    </button>
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(NamespaceAndRepositoryManagerModal)
