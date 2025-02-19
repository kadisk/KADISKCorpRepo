import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import qs from "query-string"
import { 
	useLocation
  } from "react-router-dom"


import QueryParamsActionsCreator from "../../../Actions/QueryParams.actionsCreator"

import BlankPage from "../../../Components/BlankPage"
import RepositoryEditorContainer from "../../../Containers/RepositoryEditor.container"


const RepositoryEditorPage = ({
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

    return <BlankPage>
                {
                    repositoryId
                    && <RepositoryEditorContainer repositoryId={repositoryId}/>
                }
            </BlankPage>
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

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryEditorPage)