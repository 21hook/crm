require('./check-versions')()

const argv = JSON.parse(process.env.npm_config_argv)
process.env.build_env = argv.remain[0] || 'daily' // / default env
process.env.source = argv.remain[1] || './src/views' // default folder
const config = require('../config')
const { envInfos } = require('../config/env.pramas')
// object destructuring; assignment
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

process.env.API_ROOT = envInfos[process.env.build_env].domain

// var opn = require('opn');
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

const port = process.env.PORT || config.dev.port
const autoOpenBrowser = !!config.dev.autoOpenBrowser
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000,
})

compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

Object.keys(proxyTable).forEach((context) => {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)
app.use(hotMiddleware)

const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = `http://localhost:${port}`

let _resolve
const readyPromise = new Promise((resolve) => {
    _resolve = resolve
})

console.log('> Starting dev server...')

devMiddleware.waitUntilValid(() => {
    console.log(`> Listening at ${uri}\n`)
    // if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    //     opn(uri + '/' + argv.remain[0] + '.html');
    // }
    _resolve()
})

const server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    },
}
