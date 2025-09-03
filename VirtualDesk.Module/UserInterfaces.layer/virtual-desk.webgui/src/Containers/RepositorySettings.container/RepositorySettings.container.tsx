import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import RepositorySettingsDetails from "./RepositorySettingsDetails"
import RepositoriesTable from "./RepositoriesTable"
import CardContainer from "../../Components/CardContainer"

const RepositorySettingsContainer = ({ HTTPServerManager }) => {

    const [ repositoryList, setRepositoryList ] = useState<any[]>()
    const [ repositoryDataSettings, setRepositoryDataSettings ] = useState<any>()

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

	return <CardContainer>
                { 
                    repositoryList
                    && !repositoryDataSettings
                    && <RepositoriesTable list={repositoryList} onSettings={handleChangeSettingsMode}/> 
                }
                { 
                    repositoryDataSettings
                    && <RepositorySettingsDetails
                            repositoryData={repositoryDataSettings}
                            onGoBack={handleGoBackSettings}/> 
                }
            </CardContainer>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositorySettingsContainer)
