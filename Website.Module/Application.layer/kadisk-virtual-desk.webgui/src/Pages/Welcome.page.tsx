import * as React from "react"

//@ts-ignore
import logoVirtualDesk2 from "../../Assets/logo-virtual-desk2.svg"

const WelcomePage = () => {
	return (
		<>
			<div className="page">
				<div className="sticky-top">
					<header className="navbar navbar-expand-md sticky-top d-print-none">
						<div className="container-xl">
							<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
								<a href=".">
									<img src={logoVirtualDesk2} width={200} />
								</a>
							</div>
						</div>
					</header>
				</div>
				<div className="page-wrapper">
					<div className="page-body">
						<div className="container-xl">
						</div>
					</div>
					<footer className="footer footer-transparent d-print-none">
						<div className="container-xl">
							<div className="row text-center align-items-center flex-row-reverse">
								<div className="col-12 col-lg-auto mt-3 mt-lg-0">
									<ul className="list-inline list-inline-dots mb-0">
										<li className="list-inline-item">
											Copyright © 2025 KADISK Engenharia de Software Ltda. Todos os direitos reservados.
										</li>
										<li className="list-inline-item">
											CNPJ: 50.706.455/0001-03
										</li>
										<li className="list-inline-item">
											Versão: v0.0.1-beta
										</li>
									</ul>
								</div>
							</div>
						</div>
					</footer>
				</div>
			</div>
		</>
	)
}

export default WelcomePage
