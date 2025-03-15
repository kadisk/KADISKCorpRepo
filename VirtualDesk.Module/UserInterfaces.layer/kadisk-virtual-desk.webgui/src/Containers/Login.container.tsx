import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../Utils/GetAPI"

//@ts-ignore
import logoVirtualDesk from "../../Assets/logo-virtual-desk.svg"

//@ts-ignore
import coverPicture from "../../Assets/pexels-anastasia-shuraeva-6966317.jpg"

const LoginContainer = ({ HTTPServerManager }) => {
    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const getAuthenticatorAPI = () =>
        GetAPI({
            apiName: "Authenticator",
            serverManagerInformation: HTTPServerManager
        })

    const Authenticate = async () => {
        const api = getAuthenticatorAPI()
        try {
            const response = await api.Authenticate({ username, password })
            const { token } = response.data
            localStorage.setItem("token", token)
            document.cookie = `token=${token}; path=/;`
            window.location.href = "#apps"
        } catch (error) {
            setErrorMessage("Authentication failed. Please check your credentials and try again.")
        }
    }

    const handleLogin = () => {
        setErrorMessage("")
        Authenticate()
    }

    const isFormValid = username !== "" && password !== ""

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
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form action="./" method="get">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Password</label>
                                <div className="input-group input-group-flat">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={handleLogin}
                                    disabled={!isFormValid}
                                >
                                    Login
                                </button>
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

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)