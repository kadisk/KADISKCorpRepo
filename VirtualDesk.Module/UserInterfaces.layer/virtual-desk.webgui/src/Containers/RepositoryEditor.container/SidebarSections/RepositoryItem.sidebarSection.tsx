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
const iconStack2 = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-stack-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></svg>
const iconPackages = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-packages"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M2 13.5v5.5l5 3" /><path d="M7 16.545l5 -3.03" /><path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" /><path d="M12 19l5 3" /><path d="M17 16.5l5 -3" /><path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" /><path d="M7 5.03v5.455" /><path d="M12 8l5 -3" /></svg>

const IsPackage = (typeItem) => {
    return ["app", "cli", "webapp", "webgui", "webservice", "service", "lib"].indexOf(typeItem) > -1
}


const RepositoryItemSidebarSection = ({
    repoItemSelectedId,
    onSelectItem,
    repositoryHierarchy
}) => {

    const [expandedItems, setExpandedItems] = useState({})

    const toggleExpand = (id) => {
        setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const renderHierarchy = (items) => {

        return (
            <ul className="list-group">
                {
                    items.map((item) => {

                        const content = <span onClick={() => onSelectItem(item.id)}>
                            {
                                IsPackage(item.itemType)
                                    ? iconPackage
                                    : item.itemType === "Module"
                                        ? iconPackages
                                        : item.itemType === "layer"
                                            ? iconStack2
                                            : ""
                            } {item.itemName} <span className="text-secondary">{item.itemType}</span>
                        </span>

                        return <li key={item.id} className="list-group-item border-0 p-0 cursor-pointer">
                            <div className="d-flex align-items-center">
                                {
                                    item.children
                                    && item.children.length > 0
                                    && <button className="btn btn-sm btn-link" onClick={() => toggleExpand(item.id)}>
                                        {expandedItems[item.id] ? iconCaretDown : iconCaretRight}
                                    </button>
                                }
                                {
                                    repoItemSelectedId === item.id
                                        ? <strong>{content}</strong>
                                        : content
                                }

                            </div>
                            {
                                item.children
                                && item.children.length > 0
                                && expandedItems[item.id]
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

    return <div className="col-12 bg-muted-lt">
        <div className="row justify-content-between align-items-center p-1 bg-muted text-muted-fg">
            <div className="col">
                REPOSITORY STRUTUCTURE
            </div>
        </div>
        <div className="p-2">
        {
            repositoryHierarchy.length > 0
                ? renderHierarchy(repositoryHierarchy)
                : <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
        }
        </div>
    </div>
}

export default RepositoryItemSidebarSection