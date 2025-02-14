import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

const ContainerManagerPage = () => {
  const containers = [
    { id: 1, name: "API Gateway", containerName: "api-gateway", image: "nginx:latest", address: "localhost:9000", status: "Running", cpu: "250m", memory: "128Mi", size: "500MB" },
    { id: 2, name: "API Service", containerName: "api-service", image: "node:18", address: "localhost:8888", status: "Running", cpu: "500m", memory: "256Mi", size: "750MB" },
    { id: 3, name: "User Service", containerName: "user-service", image: "python:3.9", address: "localhost:7455", status: "Stopped", cpu: "300m", memory: "256Mi", size: "650MB" },
    { id: 4, name: "Auth Service", containerName: "auth-service", image: "golang:1.18", address: "localhost:8654", status: "Running", cpu: "400m", memory: "512Mi", size: "900MB" },
    { id: 5, name: "Payment Service", containerName: "payment-service", image: "ruby:3.0", address: "localhost:9003", status: "Running", cpu: "350m", memory: "256Mi", size: "800MB" },
    { id: 6, name: "Logs Service", containerName: "logs-service", image: "fluentd:v1.14", address: "localhost:9088", status: "Running", cpu: "200m", memory: "128Mi", size: "300MB" },
    { id: 7, name: "Monitoring", containerName: "monitoring-service", image: "prometheus:latest", address: "localhost:9045", status: "Stopped", cpu: "600m", memory: "1Gi", size: "1.2GB" },
    { id: 8, name: "Dashboard", containerName: "dashboard-service", image: "grafana/grafana:latest", address: "localhost:8001", status: "Running", cpu: "500m", memory: "512Mi", size: "900MB" }
  ]

  return (
    <DefaultPageWithTitle title="Container Manager" preTitle="Ecosystem Administrator">
      <div className="container-xl">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Running Containers</h3>
          </div>
          <div className="card-body p-3">
            <div className="table-responsive">
              <table className="table card-table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Container Name</th>
                    <th>Image</th>
                    <th>Address</th>
                    <th>CPU</th>
                    <th>Memory</th>
                    <th>Size</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {containers.map((container) => (
                    <tr key={container.id}>
                      <td>{container.id}</td>
                      <td>{container.name}</td>
                      <td><span className="text-primary fw-bold">{container.containerName}</span></td>
                      <td>{container.image}</td>
                      <td>{container.address}</td>
                      <td>{container.cpu}</td>
                      <td>{container.memory}</td>
                      <td>{container.size}</td>
                      <td>
                        <span className={`badge ${container.status === "Running" ? "bg-success text-white" : "bg-danger text-white"}`}>
                          {container.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageWithTitle>
  )
}

export default ContainerManagerPage
