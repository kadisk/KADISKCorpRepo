const http = require('http')
const httpProxy = require('http-proxy')

const TransitProxyService = (params) => {
    
    const { entryPort, targetHost, onReady } = params

    const _Start = async () => {
        console.log(`TransitProxyService [0.0.0.0:${entryPort}] -> [${targetHost}] ...`)
        const proxy = httpProxy.createProxyServer({})

        // Handle errors emitted by the proxy
        proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err)
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' })
            }
            res.end('Internal Server Error')
        })

        const server = http.createServer((req, res) => {
            try {
                proxy.web(req, res, { target: targetHost }, (err) => {
                    console.error('Proxy web error:', err)
                    if (!res.headersSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' })
                    }
                    res.end('Internal Server Error')
                })
            } catch (err) {
                console.error('Server request error:', err)
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' })
                }
                res.end('Internal Server Error')
            }
        })

        server.on('error', (err) => {
            console.error('Server error:', err)
        })

        server.listen(entryPort, (err) => {
            if (err) {
                console.error('Error starting server:', err)
                return
            }
            if (typeof onReady === 'function') {
                onReady()
            }
        })
    }

    _Start().catch(err => {
        console.error('Failed to start TransitProxyService:', err)
    })

    return {}
}

module.exports = TransitProxyService
