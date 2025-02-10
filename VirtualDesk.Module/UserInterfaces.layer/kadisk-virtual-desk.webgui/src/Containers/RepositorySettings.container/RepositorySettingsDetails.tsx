import * as React from "react"

import Table from "../../Components/Table"
import CardContainer from "../../Components/CardContainer"

const RepositorySettingsDetails = ({ repositoryData, onGoBack }) => {

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

	return <CardContainer>
                <div className="card-header">
                    <div className="col">
                        <div className="page-pretitle">Repository Namespace</div>
                        <h2 className="page-title">{repositoryNamespace}</h2>
                    </div>
                    <div className="col text-end">
                        <button className="btn btn-outline-info" onClick={onGoBack}>
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
                            back
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div>
                        <div className="page-pretitle">Installation Path</div>
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
            </CardContainer>
}

export default RepositorySettingsDetails
