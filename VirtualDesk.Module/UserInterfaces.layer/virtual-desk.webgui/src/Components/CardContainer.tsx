import * as React             from "react"

const CardContainer = ({ children }) => {
	return <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
}

export default CardContainer