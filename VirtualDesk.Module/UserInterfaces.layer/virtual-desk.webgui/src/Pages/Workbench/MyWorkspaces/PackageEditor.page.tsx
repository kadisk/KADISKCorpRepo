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
import PackageEditorContainer from "../../../Containers/PackageEditor.container"


const PackageEditorPage = ({
    AddQueryParam,
    SetQueryParams,
    RemoveQueryParam
}) => {
    const location = useLocation()
	const queryParams = qs.parse(location.search.substr(1))

    const [packageId, setPackageId] = useState()
    
    useEffect(() => {
        if(Object.keys(queryParams).length > 0){
            //@ts-ignore
            setPackageId(queryParams.packageId)
        }
        
    }, [])

    return <BlankPage>
                {
                    packageId
                    && <PackageEditorContainer packageId={packageId}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PackageEditorPage)