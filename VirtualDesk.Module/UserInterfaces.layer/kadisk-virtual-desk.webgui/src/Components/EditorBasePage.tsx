import * as React from "react"

import WelcomeFooter from "../PageComponents/WelcomeFooter"
import BlankPage from "../Components/BlankPage"

const EditorBasePage = ({
    children
}) => {
	return <BlankPage>
		        <aside className="navbar navbar-vertical navbar-expand-lg">
                    <div className="container-fluid">
                
                        
                    </div>
                </aside>
				<div className="page-wrapper">
					{children}
					<WelcomeFooter/>
				</div>
		</BlankPage>
}

export default EditorBasePage
