import * as React from "react"

const UserTableTable = () => {
    return <div className="table-responsive">
        <table className="table table-vcenter card-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="w-1"></th>
                </tr>
            </thead>
            <tbody>

                <tr>
                    <td>Paweł Kuna</td>
                    <td className="text-secondary">
                        UI Designer, Training
                    </td>

                    <td className="text-secondary"><a href="#" className="text-reset">paweluna@howstuffworks.com</a></td>
                    <td className="text-secondary">

                        User
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>
                <tr>
                    <td>Jeffie Lewzey</td>
                    <td className="text-secondary">
                        Chemical Engineer, Support
                    </td>
                    <td className="text-secondary"><a href="#" className="text-reset">jlewzey1@seesaa.net</a></td>
                    <td className="text-secondary">
                        User
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>
                <tr>
                    <td>Mallory Hulme</td>
                    <td className="text-secondary">
                        Geologist IV, Support
                    </td>
                    <td className="text-secondary"><a href="#" className="text-reset">mhulme2@domainmarket.com</a></td>
                    <td className="text-secondary">
                        User
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>
                <tr>
                    <td>Dunn Slane</td>
                    <td className="text-secondary">
                        Research Nurse, Sales
                    </td>
                    <td className="text-secondary"><a href="#" className="text-reset">dslane3@epa.gov</a></td>
                    <td className="text-secondary">

                        Owner
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>
                <tr>

                    <td>Emmy Levet</td>

                    <td className="text-secondary">
                        VP Product Management, Accounting
                    </td>

                    <td className="text-secondary"><a href="#" className="text-reset">elevet4@senate.gov</a></td>

                    <td className="text-secondary">
                        User
                    </td>

                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>

                <tr>
                    <td>Maryjo Lebarree</td>

                    <td className="text-secondary">
                        Civil Engineer, Product Management
                    </td>

                    <td className="text-secondary"><a href="#" className="text-reset">mlebarree5@unc.edu</a></td>
                    <td className="text-secondary">
                        User
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>

                <tr>

                    <td>Egan Poetz</td>
                    <td className="text-secondary">
                        Research Nurse, Engineering
                    </td>
                    <td className="text-secondary"><a href="#" className="text-reset">epoetz6@free.fr</a></td>
                    <td className="text-secondary">
                        Admin
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>

                <tr>
                    <td>Kellie Skingley</td>
                    <td className="text-secondary">
                        Teacher, Services
                    </td>
                    <td className="text-secondary"><a href="#" className="text-reset">kskingley7@columbia.edu</a></td>

                    <td className="text-secondary">
                        Owner
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
}

export default UserTableTable
