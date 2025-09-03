const http = require('http')
const httpProxy = require('http-proxy')

const CreateGetTargetByHost = (routeMappingTable) => {

    const routeMapping = routeMappingTable
    .reduce((acc, route) => {
        const { host, target } = route
        return {
            ...acc,
            [host]: target
        }
    }
    , {})

    const GetTargetByHost = (host) => routeMapping[host]

    return GetTargetByHost

}

const DomainRouterProxyService = (params) => {

    const { entryPort, routeMappingTable, onReady } = params

    const _Start = async () => {

        const GetTargetByHost = CreateGetTargetByHost(routeMappingTable)

        const proxy = httpProxy.createProxyServer({})

        const server = http.createServer((request, response) => {
            
            const host = request.headers.host.split(':')[0]
            const target = GetTargetByHost(host)


            if(target === undefined) {
                response.writeHead(404, { 'Content-Type': 'text/plain' })
                response.end('Host not found!')
                return
            }
    
            proxy.web(request, response, { target }, (err) => {
                response.writeHead(500, { 'Content-Type': 'text/plain' })
                response.end(err.message)
            })
        })

        // Adicionando suporte a WebSocket
        server.on('upgrade', (request, socket, head) => {
            const host = request.headers.host.split(':')[0]
            const target = GetTargetByHost(host)

            if(target === undefined) {
                socket.write('HTTP/1.1 404 Not Found\r\n' +
                             'Content-Type: text/plain\r\n' +
                             'Connection: close\r\n' +
                             '\r\n' +
                             'Host not found!')
                socket.end()
                return
            }

            proxy.ws(request, socket, head, { target }, (err) => {
                socket.write('HTTP/1.1 500 Internal Server Error\r\n' +
                             'Content-Type: text/plain\r\n' +
                             'Connection: close\r\n' +
                             '\r\n' +
                             err.message)
                socket.end()
            })
        })

        server.listen(entryPort, () => onReady())        
    }

    _Start()

    return {}
}

module.exports = DomainRouterProxyService