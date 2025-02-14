import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

const RoutingSwitchPage = () => {
	const routes = [
		{ id: 1, name: "API Gateway", domain: "kadisk.com", path: "", target: "localhost:9000", status: "Active" },
		{ id: 2, name: "API Service", domain: "api.kadisk.com", path: "", target: "localhost:8888", status: "Active" },
		{ id: 3, name: "Website", domain: "www.kadisk.com", path: "", target: "localhost:9000", status: "Active" },
		{ id: 4, name: "User Service", domain: "users.kadisk.com", path: "", target: "localhost:7455", status: "Inactive" },
		{ id: 5, name: "Auth Service", domain: "auth.kadisk.com", path: "", target: "localhost:8654", status: "Active" },
		{ id: 6, name: "Payment Service", domain: "payments.kadisk.com", path: "", target: "localhost:9003", status: "Active" },
		{ id: 7, name: "Logs Service", domain: "logs.kadisk.com", path: "", target: "localhost:9088", status: "Active" },
		{ id: 8, name: "Monitoring", domain: "monitor.kadisk.com", path: "", target: "localhost:9045", status: "Inactive" },
		{ id: 9, name: "Worms Dashboard", domain: "worms.solutions", path: "", target: "localhost:8001", status: "Active" },
		{ id: 10, name: "API Worms", domain: "api.worms.solutions", path: "", target: "localhost:8888", status: "Active" },
		{ id: 11, name: "Admin Panel", domain: "admin.kadisk.com", path: "", target: "localhost:7455", status: "Active" },
		{ id: 12, name: "Messaging Service", domain: "messages.kadisk.com", path: "", target: "localhost:8654", status: "Active" },
		{ id: 13, name: "File Storage", domain: "storage.kadisk.com", path: "", target: "localhost:9003", status: "Inactive" },
		{ id: 14, name: "Analytics", domain: "analytics.kadisk.com", path: "", target: "localhost:9088", status: "Active" },
		{ id: 15, name: "Report Service", domain: "reports.kadisk.com", path: "", target: "localhost:9045", status: "Inactive" },
		{ id: 16, name: "Integration Service", domain: "integrations.kadisk.com", path: "", target: "localhost:8001", status: "Active" },
		{ id: 17, name: "DevOps Tools", domain: "devops.kadisk.com", path: "", target: "localhost:8888", status: "Active" },
		{ id: 18, name: "Cloud Management", domain: "cloud.kadisk.com", path: "", target: "localhost:9000", status: "Active" },
		{ id: 19, name: "Internal API", domain: "internal.kadisk.com", path: "", target: "localhost:8888", status: "Inactive" },
		{ id: 20, name: "Testing Environment", domain: "test.kadisk.com", path: "", target: "localhost:8654", status: "Active" },
		{ id: 21, name: "Documentation", domain: "www.kadisk.com", path: "/docs", target: "localhost:8080", status: "Active" },
		{ id: 22, name: "Documentation", domain: "kadisk.com", path: "/docs", target: "localhost:8080", status: "Active" }
	]

	return (
		<DefaultPageWithTitle title="Routing Switch" preTitle="Ecosystem Manager">
			<div className="container-xl">
				<div className="card">
					<div className="table-responsive">
						<table className="table card-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Domain</th>
									<th>Target</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{routes.map((route) => (
									<tr key={route.id}>
										<td>{route.id}</td>
										<td>{route.name}</td>
										<td><span className="text-primary fw-bold">{route.domain}</span></td>
										<td>{route.target}</td>
										<td>
											<span className={`badge ${route.status === "Active" ? "bg-success text-white" : "bg-danger text-white"}`}>
												{route.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</DefaultPageWithTitle>
	)
}

export default RoutingSwitchPage
