import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import WelcomeWorkspace from "./WelcomeWorkspace"
import CreateNewRepositoryModal from "./CreateNewRepository.modal"
import ImportRepositoryModal from "./ImportRepository.modal"

import GetAPI from "../../Utils/GetAPI"

const CREATE_MODE = Symbol()
const IMPORT_MODE = Symbol()
const DEFAULT_MODE = Symbol()

const MyWorkspaceContainer = ({ HTTPServerManager }) => {

    const [ interfaceModeType,  setInterfaceModeType] = useState(DEFAULT_MODE)
    const [ repositoriesCurrent, setRepositoriesCurrent ] = useState<any[]>()

    useEffect(() => {
        if(interfaceModeType === DEFAULT_MODE){
            fetchRepositories()
        }
    }, [interfaceModeType])

    const _GetMyWorkspaceAPI = () => 
        GetAPI({ 
            apiName:"MyWorkspace",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchRepositories = async () => {
        setRepositoriesCurrent(undefined)
        const api = _GetMyWorkspaceAPI()
        const response = await api.ListRepositories()
        setRepositoriesCurrent(response.data)
    }

    const handleSelectMode = (mode) => setInterfaceModeType(mode)

    const handleCloseModal = () => setInterfaceModeType(DEFAULT_MODE)

    const handleCreatedRepository = () => setInterfaceModeType(DEFAULT_MODE)

    return <>
        {interfaceModeType === CREATE_MODE && <CreateNewRepositoryModal onCreated={handleCreatedRepository} onClose={handleCloseModal} />}
        {interfaceModeType === IMPORT_MODE && <ImportRepositoryModal onClose={handleCloseModal} />}
        <div className="container py-4">
            {
                repositoriesCurrent 
                && <div className="row">
                        {
                            repositoriesCurrent.map((repo, index) => (
                                <div key={index} className="col-md-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="mb-0">{repo.namespace}</h4>
                                            <div className="card-actions">
                                                <button className="btn btn-ghost-info">Edit repository
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-2">Created at: <strong>{repo.createdAt}</strong></div>
                                        </div>
                                    </div>
                                </div>))
                        }
                    </div>
            }
            {
               !repositoriesCurrent && <p className="text-center text-muted">Carregando repositórios...</p>
            }
            
            {
                repositoriesCurrent 
                && repositoriesCurrent.length === 0
                && <WelcomeWorkspace
                        onSelectCreateRepository={() => handleSelectMode(CREATE_MODE)}
                        onSelectImportRepository={() => handleSelectMode(IMPORT_MODE)}/>
            }
        </div>
    </>
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(MyWorkspaceContainer)
