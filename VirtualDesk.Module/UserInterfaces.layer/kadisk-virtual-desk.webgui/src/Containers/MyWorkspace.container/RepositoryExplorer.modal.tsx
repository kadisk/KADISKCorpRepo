import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

const RepositoryExplorerModal = ({ onClose, HTTPServerManager }) => {
    const [expanded, setExpanded] = React.useState({ commons: true })

    const toggleExpand = (key) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Repository Explorer</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <div className="repository-explorer">
                            <ul className="repository-list">
                                <li>
                                    <a  style={{ color: "#007bff" }} className="cursor-pointer" onClick={() => toggleExpand('commons')}>
                                        {
                                            expanded.commons 
                                            ? <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-caret-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 10l6 6l6 -6h-12" /></svg>
                                            : <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-caret-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 18l6 -6l-6 -6v12" /></svg>} Commons
                                    </a>
                                    {expanded.commons && (
                                        <ul className="nested-list">
                                            <li><strong>Layers</strong></li>
                                            <li><a className="cursor-pointer">Libraries</a></li>
                                            <li><a className="cursor-pointer">PlatformLibraries</a></li>
                                            <li><a className="cursor-pointer">Utilities</a></li>
                                        </ul>
                                    )}
                                </li>
                                <li><a className="cursor-pointer">Runtime</a></li>
                                <li><a className="cursor-pointer">Main</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    .repository-explorer {
                        padding: 10px;
                    }
                    .repository-list {
                        list-style: none;
                        padding: 0;
                    }
                    .repository-list > li {
                        margin: 5px 0;
                    }
                    .nested-list {
                        list-style: none;
                        padding-left: 20px;
                    }
                    .cursor-pointer {
                        cursor: pointer;
                        color: #007bff;
                        text-decoration: none;
                    }
                    .cursor-pointer:hover {
                        text-decoration: underline;
                    }

                    .repository-list li a {
                        color: inherit;
                        font-weight: bold;
                    }
                `}
            </style>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryExplorerModal)
