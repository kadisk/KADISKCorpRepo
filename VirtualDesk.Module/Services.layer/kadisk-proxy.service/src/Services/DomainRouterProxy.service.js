const http = require('http')
const httpProxy = require('http-proxy')


const PORT = 80

const ROUTE_MAPPING_TABLE = [
    {
        host: 'kadisk.com.local',
        target: 'http://localhost:6001'
    },
    {
        host: 'virtual-desk.com.local',
        target: 'http://localhost:6002'
    },
    {
        host: 'worms.solutions.local',
        target: 'http://localhost:6003'
    }
]


const CreateGetTargetByHost = (routeTableMapping) => {

    const routeMapping = routeTableMapping
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

    const {
        onReady 
    } = params

    const _Start = async () => {

        const GetTargetByHost = CreateGetTargetByHost(ROUTE_MAPPING_TABLE)

        const proxy = httpProxy.createProxyServer({})

        const server = http.createServer((request, response) => {
            
            const host = request.headers.host.split(':')[0]
            const target = GetTargetByHost(host)


            if(target === undefined) {
                response.writeHead(404, { 'Content-Type': 'text/plain' })
                response.end('Host não encontrado')
                return
            }
    
            proxy.web(request, response, { target }, (err) => {
                response.writeHead(500, { 'Content-Type': 'text/plain' })
                response.end(err)
            })
        })

        server.listen(PORT, () => onReady())        
    }

    _Start()

    return {}
}

module.exports = DomainRouterProxyService