import * as React from "react"


type TableProps = {
    allTdClassName?:string
    columnsDefinition:any
    list:any[]
}

const Table = ({
    allTdClassName,
    columnsDefinition,
    list
}: TableProps) => {

    const columnsName = Object.keys(columnsDefinition)
    const columnsProperty = Object.values(columnsDefinition)

    return <table className="table table-vcenter card-table">
                <thead>
                    <tr>
                        {
                            columnsName
                            .map((columnName) => <th>{columnName}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        (list || [])
                        .map((data) =>
                            <tr>
                                {
                                    columnsProperty
                                    .map((property:any) => <td className={allTdClassName}>{data[property]}</td>)
                                }
                            </tr>)
                    }
                </tbody>
            </table>
}

export default Table
