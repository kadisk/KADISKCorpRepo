import * as React             from "react"
import { useEffect}           from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"
import qs                     from "query-string"
import { 
	useLocation,
	useNavigate,
	useParams
  } from "react-router-dom"

import QueryParamsActionsCreator    from "../Actions/QueryParams.actionsCreator"

import DefaultPage from "../Components/DefaultPage"

import ServiceSettingsPanelContainer from "../Containers/MyServices.container/ServiceSettingsPanel.container"

const ServiceSettingsPage = ({
    SetQueryParams,
	QueryParams
}) => {

    const { serviceId } = useParams()
	const location = useLocation()
  	const navigate = useNavigate()
	const queryParams = qs.parse(location.search.substr(1))

	useEffect(() => {
		if(Object.keys(queryParams).length > 0){
			SetQueryParams(queryParams)
		}
	}, [])

	useEffect(() => {
		const search = qs.stringify(QueryParams)
		navigate({search: `?${search}`})
	}, [QueryParams])

    return <DefaultPage>
                <div className="page-body">
                    <ServiceSettingsPanelContainer serviceId={serviceId}/>
                </div>
            </DefaultPage>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({
	SetQueryParams    : QueryParamsActionsCreator.SetQueryParams,
	AddQueryParam     : QueryParamsActionsCreator.AddQueryParam,
	RemoveQueryParam  : QueryParamsActionsCreator.RemoveQueryParam
}, dispatch)

const mapStateToProps = ({QueryParams}:any) => ({
	QueryParams
})


export default connect(mapStateToProps, mapDispatchToProps)(ServiceSettingsPage)
