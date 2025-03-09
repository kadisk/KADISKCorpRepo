const http = require('http')
const httpProxy = require('http-proxy')


const PassThroughProxyService = (params) => {

    const {
        listenPort,
        target,
        onReady 
    } = params

    const _Start = async () => {

        const proxy = httpProxy.createProxyServer({})

        const server = http.createServer((request, response) => {
            proxy.web(request, response, { target }, (err) => {
                response.writeHead(500, { 'Content-Type': 'text/plain' })
                response.end(err)
            })
        })

        server.listen(listenPort, () => onReady())        
    }

    _Start()

    return {}
}

module.exports = PassThroughProxyService