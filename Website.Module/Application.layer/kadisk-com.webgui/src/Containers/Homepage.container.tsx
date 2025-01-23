import * as React from "react"

import { 
	Container, 
	Segment,
	Button,
	Header,
	Icon,
	Menu,
	MenuItem,
	MenuMenu
} from "semantic-ui-react"

import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

//@ts-ignore
import backgroundImageUrl from "../../Assets/pexels-g-cortez-1520507-9139967.jpg"

//@ts-ignore
import logo1svg from "../../Assets/logo.svg"

type HomepageParamsType = {
	api     ?: string
	summary ?: string
}

type HomepageContainerProps = {
	queryParams         : HomepageParamsType
	onChangeQueryParams : any
	HTTPServerManager   : any
}

const SERVER_APP_NAME = process.env.SERVER_APP_NAME

const HomepageContainer = ({
	queryParams,
	onChangeQueryParams, 
	HTTPServerManager
}:HomepageContainerProps) => {

	return <>
		<Menu style={{marginBottom:"0", borderRadius:0}} size='huge' inverted>
			<MenuMenu position='right'>
				<MenuItem
					name='virtual-desk' href="/desk">
					Virtual Desk
				</MenuItem>
			</MenuMenu>
		</Menu>
		<div
	style={{
		padding: "1em 0em",
		backgroundImage: `url(${backgroundImageUrl})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		minHeight: "86vh",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center"
	}}
>
		<Container fluid>
		<img alt='logo' src={logo1svg} style={{marginLeft: "15px","width": "40vh"}}/>
		</Container>
	</div>
	<Segment inverted vertical style={{ padding: '2em 0em' }}>
		<Container textAlign='center'>
			<p>
				© {new Date().getFullYear()} Kadisk Engenharia de Software LTDA. Todos os direitos reservados.
			</p>
		</Container>
	</Segment>
	</>
}

const mapDispatchToProps = (dispatch:any) =>
 bindActionCreators({

}, dispatch)

const mapStateToProps = ({HTTPServerManager}:any) => ({
	HTTPServerManager
})

export default connect(mapStateToProps, mapDispatchToProps)(HomepageContainer)
