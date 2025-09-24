import * as React from "react"
import { useEffect, useState } from "react"

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

const iconCategory2 = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-category-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6h-6z" /><path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>
const iconCodeVariable = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-code-variable"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /></svg>
const iconBracketsContain = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-brackets-contain"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4h-4v16h4" /><path d="M17 4h4v16h-4" /><path d="M8 16h.01" /><path d="M12 16h.01" /><path d="M16 16h.01" /></svg>
const iconCodeDots = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-code-dots"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 12h.01" /><path d="M12 12h.01" /><path d="M9 12h.01" /><path d="M6 19a2 2 0 0 1 -2 -2v-4l-1 -1l1 -1v-4a2 2 0 0 1 2 -2" /><path d="M18 19a2 2 0 0 0 2 -2v-4l1 -1l-1 -1v-4a2 2 0 0 0 -2 -2" /></svg>

const IsObjectOrArray = (value) => {
    if (Array.isArray(value))
        return true
    
    if (typeof value === 'object' && value !== null)
        return true
    
    return false
  }

const MetadataNavigatorSidebarSection = ({
    packageMetadata
}) => {

    const [expandedItems, setExpandedItems] = useState({})
    const [ metadataNameList, setMetadataNameList ] = useState<string[]>()

    useEffect(() => {
        if(packageMetadata){
            setMetadataNameList(Object.keys(packageMetadata))
        }
    }, [packageMetadata])

    const toggleExpand = (code) => {
        setExpandedItems((prev) => ({ ...prev, [code]: !prev[code] }))
    }

    const renderObjectValue = (metadataContent, parentCode) => {
       
        if (Array.isArray(metadataContent)) {
            return <ul className="list-group">
                        {
                            metadataContent
                            && metadataContent.map((value, index) => {

                                const code = parentCode + index

                                return <li className="list-group-item border-0 p-0 cursor-pointer">
                                            <div className="d-flex align-items-center">
                                                {
                                                    IsObjectOrArray(value)
                                                    && <button className="btn btn-sm btn-link" onClick={() => toggleExpand(code)}>
                                                        {expandedItems[code] ? iconCaretDown : iconCaretRight}
                                                    </button>
                                                }
                                                {
                                                    IsObjectOrArray(value)
                                                        ? <span>
                                                                {Array.isArray(value) ? iconBracketsContain : iconCodeDots} [{index}]
                                                            </span>
                                                        :<span>
                                                                {iconCodeVariable} <span className="text-secondary">[{index}]</span> <strong>{value}</strong>
                                                        </span>
                                                }
                                            </div>
                                            {
                                                IsObjectOrArray(value)
                                                && expandedItems[code]
                                                && <div className="ms-2 mt-1 border-start ps-3">
                                                    {renderObjectValue(value, code)}
                                                </div>
                                            }
                                        </li>
                            })
                        }
                    </ul>
        }

        const properties = Object.keys(metadataContent)
        return <ul className="list-group">
                    {
                        properties
                        && properties.map((propertyName) => {

                            const code = parentCode + propertyName

                            return <li className="list-group-item border-0 p-0 cursor-pointer">
                                        <div className="d-flex align-items-center">
                                            {
                                                IsObjectOrArray(metadataContent[propertyName])
                                                && <button className="btn btn-sm btn-link" onClick={() => toggleExpand(code)}>
                                                    {expandedItems[code] ? iconCaretDown : iconCaretRight}
                                                </button>
                                            }
                                            {
                                                IsObjectOrArray(metadataContent[propertyName])
                                                ? <span>
                                                        {Array.isArray(metadataContent[propertyName]) ? iconBracketsContain : iconCodeDots} [{propertyName}]
                                                    </span>
                                                :<span>
                                                        {iconCodeVariable} <span className="text-secondary">[{propertyName}]</span> <strong>{metadataContent[propertyName]}</strong>
                                                </span>
                                            }
                                        </div>
                                        {
                                            IsObjectOrArray(metadataContent[propertyName])
                                            && expandedItems[code]
                                            && <div className="ms-2 mt-1 border-start ps-3">
                                                {renderObjectValue(metadataContent[propertyName], code)}
                                            </div>
                                        }
                                    </li>
                        })
                    }
                </ul>

    }

    const renderMetadataList = (metadataNameList) => {

        return <ul className="list-group">
                {
                    metadataNameList
                    && metadataNameList.map((metadataName) => {

                        return <li className="list-group-item border-0 p-0 cursor-pointer">
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-sm btn-link" onClick={() => toggleExpand(metadataName)}>
                                            {expandedItems[metadataName] ? iconCaretDown : iconCaretRight}
                                        </button>
                                        <span>{iconCategory2} {metadataName}</span>
                                    </div>
                                    {
                                        expandedItems[metadataName]
                                        && <div className="ms-2 mt-1 border-start ps-3">
                                            {renderObjectValue(packageMetadata[metadataName], metadataName)}
                                        </div>
                                    }
                                </li>
                    })
                }
            </ul>
    }

    return <div className="col-12 bg-indigo-lt">
        <div className="justify-content-start align-items-center p-1 bg-indigo text-indigo-fg">
            METADATA NAVIGATOR
        </div>
        <div className="p-2">
            {
                metadataNameList?.length > 0
                    ? renderMetadataList(metadataNameList)
                    : <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }
        </div>
        
    </div>
}

export default MetadataNavigatorSidebarSection