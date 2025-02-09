import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"

import GetAPI from "../../Utils/GetAPI"

const LogStreamingModal = ({ socketFileId, onClose, HTTPServerManager }) => {
    const [socket, setSocket] = useState(null)
    const terminalRef = useRef(null)
    const term = useRef(null)
    const fitAddon = useRef(null)

    const GetInstanceMonitoringAPI = () => 
        GetAPI({ 
            apiName: "InstanceMonitoring",  
            serverManagerInformation: HTTPServerManager
        })

    useEffect(() => {
        // Inicializa o terminal apenas uma vez quando o modal é aberto
        if (!term.current) {
            term.current = new Terminal({
                theme: { background: "#1e1e1e", foreground: "#ffffff" },
                fontSize: 14,
                cursorBlink: true,
                disableStdin: true // Impede entrada do usuário
            })

            fitAddon.current = new FitAddon()
            term.current.loadAddon(fitAddon.current)
            term.current.open(terminalRef.current)
            fitAddon.current.fit()
        }
    }, [])

    const handleConnect = () => {
        if (socket) return

        const api = GetInstanceMonitoringAPI()
        const logStreamingSocket = api.LogStreaming({ socketFileId })

        logStreamingSocket.onopen = () => {
            term.current.writeln("🔌 Conexão iniciada...")
        }

        logStreamingSocket.onmessage = (event) => {
            const { data } = event
            const dataLog = JSON.parse(data)
            
            // Exibir log no terminal
            term.current.writeln(dataLog.message)
        }

        logStreamingSocket.onclose = () => {
            term.current.writeln("❌ Conexão fechada.")
        }

        setSocket(logStreamingSocket)
    }

    return (
        <div 
            className="modal modal-blur show" 
            role="dialog" 
            aria-hidden="false" 
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Instance Log Streaming</h5>
                        <button type="button" className="btn-close" onClick={onClose}/>
                    </div>
                    <div className="modal-body">
                        <div ref={terminalRef} style={{ height: "300px", width: "100%", backgroundColor: "#1e1e1e" }} />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-link link-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button 
                            disabled={!!socket}
                            onClick={handleConnect}
                            className="btn btn-primary ms-auto" 
                            data-bs-dismiss="modal"
                        >
                            <svg  
                                xmlns="http://www.w3.org/2000/svg"  
                                width="24"  
                                height="24"  
                                viewBox="0 0 24 24"  
                                fill="none"  
                                stroke="currentColor"  
                                strokeWidth="2"  
                                strokeLinecap="round"  
                                strokeLinejoin="round"  
                                className="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5z" />
                                <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5z" />
                                <path d="M3 21l2.5 -2.5" />
                                <path d="M18.5 5.5l2.5 -2.5" />
                                <path d="M10 11l-2 2" />
                                <path d="M13 14l-2 2" />
                            </svg>
                            Connect to Log Streaming
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(LogStreamingModal)
