const http = require('http')
const httpProxy = require('http-proxy')

const TransitProxyService = (params) => {

    const {
        entryPort,
        targetHost,
        onReady 
    } = params

    const _Start = async () => {

       console.log(`TransitProxyService [0.0.0.0:${entryPort}] -> [${targetHost}] ...`)
        const proxy = httpProxy.createProxyServer({})

        const server = http.createServer((request, response) => {
            proxy.web(request, response, { target: targetHost }, (err) => {
                response.writeHead(500, { 'Content-Type': 'text/plain' })
                response.end(err)
            })
        })

        server.listen(entryPort, () => onReady())        
    }

    _Start()

    return {}
}

module.exports = TransitProxyService