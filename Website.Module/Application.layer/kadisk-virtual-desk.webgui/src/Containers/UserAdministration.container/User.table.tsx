import * as React from "react"

import Table from "../../Components/Table"

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
