import * as React from "react"

import DefaultPageWithTitle from "../../Components/DefaultPageWithTitle"

const HostOSSettingsPage = () => {
  	
	const systemInfo = {
		hostname: "ubuntu-server",
		os: "Ubuntu 22.04 LTS",
		kernel: "5.15.0-84-generic",
		uptime: "14 days, 3 hours, 25 minutes",
		loadAverage: "0.82, 0.64, 0.70",
		cpu: "4 vCPUs",
		memory: "8GB RAM",
		diskTotal: "100GB",
		diskUsed: "45GB",
		diskFree: "55GB",
	}

  return (
    <DefaultPageWithTitle title="Host OS Settings" preTitle="Ecosystem Administrator">
      <div className="container-xl">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">System Overview</h3>
          </div>
          <div className="card-body p-3">
            <table className="table card-table table-striped">
              <tbody>
                <tr>
                  <td><strong>Hostname</strong></td>
                  <td>{systemInfo.hostname}</td>
                </tr>
                <tr>
                  <td><strong>Operating System</strong></td>
                  <td>{systemInfo.os}</td>
                </tr>
                <tr>
                  <td><strong>Kernel Version</strong></td>
                  <td>{systemInfo.kernel}</td>
                </tr>
                <tr>
                  <td><strong>Uptime</strong></td>
                  <td>{systemInfo.uptime}</td>
                </tr>
                <tr>
                  <td><strong>Load Average</strong></td>
                  <td>{systemInfo.loadAverage}</td>
                </tr>
                <tr>
                  <td><strong>CPU</strong></td>
                  <td>{systemInfo.cpu}</td>
                </tr>
                <tr>
                  <td><strong>Memory</strong></td>
                  <td>{systemInfo.memory}</td>
                </tr>
                <tr>
                  <td><strong>Disk Usage</strong></td>
                  <td>{systemInfo.diskUsed} / {systemInfo.diskTotal} (Free: {systemInfo.diskFree})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultPageWithTitle>
  )
}

export default HostOSSettingsPage
