import * as React from "react"

//@ts-ignore
import logoVirtualDesk from "../../Assets/logo-virtual-desk.svg"

//@ts-ignore
import coverPicture from "../../Assets/pexels-anastasia-shuraeva-6966317.jpg"

const LoginContainer = () => {
	return (
		<>
			<div className="row g-0 flex-fill">
				<div className="col-12 col-lg-6 col-xl-4 border-top-wide border-primary d-flex flex-column justify-content-center">
					<div className="container container-tight my-5 px-lg-5">
						<div className="text-center mb-4">
							<a href="." className="navbar-brand navbar-brand-autodark">
								<img src={logoVirtualDesk} width={200} />
							</a>
						</div>
						<form action="./" method="get">
							<div className="mb-3">
								<label className="form-label">Usuário</label>
								<input type="email" className="form-control" placeholder="Usuário" />
							</div>
							<div className="mb-2">
								<label className="form-label">
									Senha
								</label>
								<div className="input-group input-group-flat">
									<input type="password" className="form-control" placeholder="Sua senha" />
									<span className="input-group-text">
										<a
											href="#"
											className="link-secondary"
											data-bs-toggle="tooltip"
											aria-label="Mostrar senha"
											data-bs-original-title="Mostrar senha"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												className="icon icon-1"
											>
												<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
												<path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
											</svg>
										</a>
									</span>
								</div>
							</div>


							<div className="form-footer">
								<a className="btn btn-primary w-100" href="#/welcome">
									Entrar
								</a>
							</div>
						</form>
					</div>
				</div>
				<div className="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
					<div
						className="bg-cover h-100 min-vh-100"
						style={{ backgroundImage: `url(${coverPicture})` }}
					></div>
				</div>
			</div>
		</>
	)
}

export default LoginContainer
