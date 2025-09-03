import * as React from "react"

const WelcomeFooter = () => {
	return <footer className="footer footer-transparent d-print-none p-3">
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
}

export default WelcomeFooter
