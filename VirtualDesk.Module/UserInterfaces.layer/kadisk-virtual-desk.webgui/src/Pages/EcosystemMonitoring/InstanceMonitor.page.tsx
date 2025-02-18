import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import qs from "query-string"
import { 
	useLocation
  } from "react-router-dom"


import DefaultPage from "../../Components/DefaultPage"

import QueryParamsActionsCreator from "../../Actions/QueryParams.actionsCreator"


import InstanceMonitorContainer from "../../Containers/InstanceMonitor.container"

const InstanceMonitorPage = ({
    AddQueryParam,
    SetQueryParams,
    RemoveQueryParam
}) => {

    const location = useLocation()
	const queryParams = qs.parse(location.search.substr(1))

	const [socketFileId, setSocketFileId] = useState()

    useEffect(() => {

		if(Object.keys(queryParams).length > 0){
			//@ts-ignore
			setSocketFileId(queryParams.socketFileId)
		}
		
	}, [])

    return <DefaultPage>
				{
					socketFileId
					&& <InstanceMonitorContainer socketFileId={socketFileId}/>
				}
            </DefaultPage>
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

export default connect(mapStateToProps, mapDispatchToProps)(InstanceMonitorPage)