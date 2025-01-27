import * as React from "react"

const Table = ({
    columnsDefinition,
    list
}) => {

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
                                    .map((property:any) => <td>{data[property]}</td>)
                                }
                            </tr>)
                    }
                </tbody>
            </table>
}

const UserTableTable = ({ users }) => {

    const columnsDefinition = {
        Name: "name",
        Email: "email",
        Username: "username"
    }

    return <div className="table-responsive">
        <Table list={users} columnsDefinition={columnsDefinition} />
    </div>
}

export default UserTableTable
