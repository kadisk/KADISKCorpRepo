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
					<div className="page-header d-print-none">
						<div className="container-xl">
							<div className="row g-2 align-items-center">
								<div className="col">
									<h2 className="page-title">
										User administration
									</h2>
								</div>
								<div className="col-auto ms-auto d-print-none">
									<div className="d-flex">
										<a href="#" className="btn btn-primary btn-3">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-2"><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg>
											New user
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="page-body">
						<div className="container-xl">
							<div className="col-lg-12">
								<div className="card">
									<div className="table-responsive">
										<table className="table table-vcenter card-table">
											<thead>
												<tr>
													<th>Name</th>
													<th>Title</th>
													<th>Email</th>
													<th>Role</th>
													<th className="w-1"></th>
												</tr>
											</thead>
											<tbody>

												<tr>
													<td>Paweł Kuna</td>
													<td className="text-secondary">
														UI Designer, Training
													</td>

													<td className="text-secondary"><a href="#" className="text-reset">paweluna@howstuffworks.com</a></td>
													<td className="text-secondary">

														User
													</td>
													<td>
														<a href="#">Edit</a>
													</td>
												</tr>
												<tr>
													<td>Jeffie Lewzey</td>
													<td className="text-secondary">
														Chemical Engineer, Support
													</td>
													<td className="text-secondary"><a href="#" className="text-reset">jlewzey1@seesaa.net</a></td>
													<td className="text-secondary">
														User
													</td>
													<td>
														<a href="#">Edit</a>
													</td>
												</tr>
												<tr>
													<td>Mallory Hulme</td>
													<td className="text-secondary">
														Geologist IV, Support
													</td>
													<td className="text-secondary"><a href="#" className="text-reset">mhulme2@domainmarket.com</a></td>
													<td className="text-secondary">
														User
													</td>
													<td>
														<a href="#">Edit</a>
													</td>
												</tr>
												<tr>
													<td>Dunn Slane</td>
													<td className="text-secondary">
														Research Nurse, Sales
													</td>
													<td className="text-secondary"><a href="#" className="text-reset">dslane3@epa.gov</a></td>
													<td className="text-secondary">

														Owner
													</td>
													<td>
														<a href="#">Edit</a>
													</td>
												</tr>
												<tr>

													<td>Emmy Levet</td>

													<td className="text-secondary">
														VP Product Management, Accounting
													</td>

													<td className="text-secondary"><a href="#" className="text-reset">elevet4@senate.gov</a></td>

													<td className="text-secondary">
														User
													</td>

													<td>
														<a href="#">Edit</a>
													</td>
												</tr>

												<tr>
													<td>Maryjo Lebarree</td>

													<td className="text-secondary">
														Civil Engineer, Product Management
													</td>

													<td className="text-secondary"><a href="#" className="text-reset">mlebarree5@unc.edu</a></td>
													<td className="text-secondary">
														User
													</td>
													<td>
														<a href="#">Edit</a>
													</td>
												</tr>

												<tr>

													<td>Egan Poetz</td>
													<td className="text-secondary">
														Research Nurse, Engineering
													</td>
													<td className="text-secondary"><a href="#" className="text-reset">epoetz6@free.fr</a></td>
													<td className="text-secondary">
														Admin
													</td>
													<td>
														<a href="#">Edit</a>
													</td>
												</tr>

												<tr>
													<td>Kellie Skingley</td>
													<td className="text-secondary">
														Teacher, Services
													</td>
													<td className="text-secondary"><a href="#" className="text-reset">kskingley7@columbia.edu</a></td>

													<td className="text-secondary">
														Owner
													</td>
													<td>
														<a href="#">Edit</a>
													</td>
												</tr>

											</tbody>
										</table>
									</div>
								</div>
							</div>
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
