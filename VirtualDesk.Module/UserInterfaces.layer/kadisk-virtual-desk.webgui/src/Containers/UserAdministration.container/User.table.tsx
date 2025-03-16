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
                        <th></th>
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
                                <td>
                                    <div className="btn-list flex-nowrap">
                                        <button className="btn btn-1"> Edit </button>
                                    </div>
                                </td>
                            </tr>)
                    }
                </tbody>
            </table>
}


const UserTable = ({ users }) => {

    const columnsDefinition = {
        Name: "name",
        Email: "email",
        Username: "username"
    }

    return <div className="table-responsive">
        <Table list={users} columnsDefinition={columnsDefinition} />
    </div>
}

export default UserTable
