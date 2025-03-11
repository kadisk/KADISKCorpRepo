const http = require('http')
const httpProxy = require('http-proxy')

const TransitProxyService = (params) => {

    const {
        listenPort,
        destination,
        onReady 
    } = params

    const _Start = async () => {

       console.log("`TransitProxyService [0.0.0.0:${listenPort}] -> [${destination}] ...`")
        const proxy = httpProxy.createProxyServer({})

        const server = http.createServer((request, response) => {
            proxy.web(request, response, { target: destination }, (err) => {
                response.writeHead(500, { 'Content-Type': 'text/plain' })
                response.end(err)
            })
        })

        server.listen(listenPort, () => onReady())        
    }

    _Start()

    return {}
}

module.exports = TransitProxyService