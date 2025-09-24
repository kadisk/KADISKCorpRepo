import * as React from "react"
import { useState } from "react"

const iconCaretRight = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-caret-right"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 18l6 -6l-6 -6v12" />
    </svg>
)

const iconCaretDown = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-caret-down"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 10l6 6l6 -6h-12" />
    </svg>
)

const iconPackage = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-package"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>
const iconFolder = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" /></svg>
const iconFile = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>

const IsPackage = (typeItem) => {
    return ["app", "cli", "webapp", "webgui", "webservice", "service", "lib"].indexOf(typeItem) > -1
}


const SourceTreeSidebarSection = ({
    sourceTree,
    onSelectSourceFile
}) => {

    const [expandedItems, setExpandedItems] = useState({})

    const toggleExpand = (code) => {
        setExpandedItems((prev) => ({ ...prev, [code]: !prev[code] }))
    }

    const getHandleSelectPackageFile = (itemData) => () => onSelectSourceFile(`${itemData.path}/${itemData.name}`)

    const renderHierarchy = (items) => {

        return (
            <ul className="list-group">
                {
                    items.map((item) => {

                        const code = item.path+item.name+item.type
                        const hasLevel = item.children && item.children.length > 0

                        return <li key={code} className="list-group-item border-0 p-0 cursor-pointer">
                            <div className="d-flex align-items-center">
                                {
                                    hasLevel
                                    && <button className="btn btn-sm btn-link" onClick={() => toggleExpand(code)}>
                                        {expandedItems[code] ? iconCaretDown : iconCaretRight}
                                    </button>
                                }
                                <span className={hasLevel?"":"ms-4"} onClick={item.type === "file" && getHandleSelectPackageFile(item)}>
                                    {
                                            IsPackage(item.type)
                                                ? iconPackage
                                                : item.type === "directory"
                                                    ? iconFolder
                                                    : item.type === "file"
                                                        ? iconFile
                                                        : ""
                                        } {item.name}
                                </span>

                            </div>
                            {
                                item.children
                                && item.children.length > 0
                                && expandedItems[code]
                                && <div className="ms-2 mt-1 border-start ps-3">
                                    {renderHierarchy(item.children)}
                                </div>
                            }
                        </li>
                    })
                }
            </ul>
        )
    }

    return <div className="col-12 mb-3 bg-azure-lt">
        <div className="justify-content-start align-items-center p-1 bg-azure text-azure-fg">
            <strong>source code</strong>
        </div>
        <div className="p-2">
            {
                sourceTree
                    ? renderHierarchy(sourceTree)
                    : <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }
        </div>
        
    </div>
}

export default SourceTreeSidebarSection