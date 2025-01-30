import * as React             from "react"

const RepositoriesTable = ({ list, onSettings }) => {

    return <div className="table-responsive">
                <table className="table table-vcenter table-mobile-md card-table">
                    <tbody>
                        {
                            list
                            .map((repositoryData) => {

                                const { 
                                    repositoryNamespace,
                                    sourceData
                                } = repositoryData

                                return <tr>
                                            <td>
                                                <div className="text-secondary">Repository Namespace</div>
                                                <div><h3>{repositoryNamespace}</h3></div>
                                                <div className="card m-2 bg-primary-lt">
                                                    <div className="card-body p-2">
                                                    <h5 className="mb-1">Source data</h5>
                                                    <div className="datagrid">
                                                        {
                                                            Object.keys(sourceData)
                                                            .map((key) => 
                                                                <div className="datagrid-item">
                                                                    <div className="datagrid-title">{key}</div>
                                                                    <div className="datagrid-content">{sourceData[key]}</div>
                                                                </div>)
                                                        }
                                                    </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-outline-info m-2" onClick={() => onSettings(repositoryData)}>
                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6 4v4" /><path d="M6 12v8" /><path d="M13.199 14.399a2 2 0 1 0 -1.199 3.601" /><path d="M12 4v10" /><path d="M12 18v2" /><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M18 4v1" /><path d="M18 9v2.5" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>
                                                    settings
                                                </button>
                                                <button className="btn btn-warning">
                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
                                                    update repository content 
                                                </button>
                                            </td>
                                        </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
}

export default RepositoriesTable
