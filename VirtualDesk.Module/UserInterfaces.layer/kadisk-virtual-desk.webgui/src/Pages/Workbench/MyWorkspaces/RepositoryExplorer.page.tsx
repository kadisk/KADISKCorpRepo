import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import qs from "query-string"
import { 
	useLocation
  } from "react-router-dom"


import QueryParamsActionsCreator from "../../../Actions/QueryParams.actionsCreator"

import DefaultPageWithTitle from "../../../Components/DefaultPageWithTitle"
import RepositoryExplorerContainer from "../../../Containers/RepositoryExplorer.container"


const RepositoryExplorerPage = ({
    AddQueryParam,
    SetQueryParams,
    RemoveQueryParam
}) => {
    const location = useLocation()
	const queryParams = qs.parse(location.search.substr(1))

    const [repositoryId, setRepositoryId] = useState()
    
    useEffect(() => {
        if(Object.keys(queryParams).length > 0){
            //@ts-ignore
            setRepositoryId(queryParams.repositoryId)
        }
        
    }, [])

    return <DefaultPageWithTitle title="Repository Explorer" preTitle="Workbench / My Workspace">
                {
                    repositoryId
                    && <RepositoryExplorerContainer repositoryId={repositoryId}/>
                }
            </DefaultPageWithTitle>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({
	AddQueryParam    : QueryParamsActionsCreator.AddQueryParam,
	SetQueryParams   : QueryParamsActionsCreator.SetQueryParams,
	RemoveQueryParam : QueryParamsActionsCreator.RemoveQueryParam
}, dispatch)

const mapStateToProps = ({HTTPServerManager, QueryParams}:any) => ({
	HTTPServerManager,
	QueryParams
})

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryExplorerPage)