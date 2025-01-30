import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

import Table from "../Components/Table"

const RepositorySettings = ({ repositoryData, onGoBack }) => {

    const { 
        repositoryNamespace,
        installationPath,
        sourceData,
        installedApplications
    } = repositoryData

	const columnsDefinition = {
		"Executable": "executable",
		"App Type": "appType",
		"Package Namespace": "packageNamespace",
		"Supervisor Socket File Name": "supervisorSocketFileName"
	}

	return <div className="row row-cards">
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<div className="col">
						<div className="page-pretitle">Repository Namespace</div>
						<h2 className="page-title">{repositoryNamespace}</h2>
					</div>
                    <div className="col text-end">
                        <button className="btn" onClick={onGoBack}>
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
                            go back
                        </button>
                    </div>
				</div>
				<div className="card-body">
					<div>
						<div className="text-secondary">Installation Path</div>
						<div>{installationPath}</div>
					</div>
				</div>
				<div className="card-body">
					<h4>Source Data</h4>
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
				<div className="card-body">
					<h4>Installed Applications</h4>
					<Table list={installedApplications} columnsDefinition={columnsDefinition} />
				</div>
			</div>
		</div>
	</div>
}

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
                                                <button className="btn btn-secondary m-2" onClick={() => onSettings(repositoryData)}>
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

const RepositorySettingsContainer = ({ HTTPServerManager }) => {

    const [ repositoryList, setRepositoryList ] = useState<any[]>()
    const [ repositoryDataSettings, setRepositoryDataSettings ] = useState<any>()

    console.log(repositoryList)

    useEffect(() => {
        fetchDefaultParameters()
    }, [])

    const getRepositorySettingsAPI = () => 
        GetAPI({ 
            apiName:"RepositorySettings",  
            serverManagerInformation: HTTPServerManager
        })
    
    const fetchDefaultParameters = async () => {
        setRepositoryList(undefined)
        const api = getRepositorySettingsAPI()
        const response = await api.ListRepositories()
        setRepositoryList(response.data)
    }

    const handleChangeSettingsMode = (repositoryData) => {
        setRepositoryDataSettings(repositoryData)
    }

    const handleGoBackSettings = () => {
        setRepositoryDataSettings(undefined)
    }

	return <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            { 
                                repositoryList
                                && !repositoryDataSettings
                                && <RepositoriesTable list={repositoryList} onSettings={handleChangeSettingsMode}/> 
                            }
                            { 
                                repositoryDataSettings
                                && <RepositorySettings 
                                        repositoryData={repositoryDataSettings}
                                        onGoBack={handleGoBackSettings}/> 
                            }
                        </div>
                    </div>
                </div>
            </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositorySettingsContainer)
