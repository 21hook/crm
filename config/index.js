const path = require('path')
const { envInfos } = require('./env.pramas')

const envInfo = envInfos[process.env.build_env]
const buildPath = '../dist'

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, `${buildPath}/index.html`),
        assetsRoot: path.resolve(__dirname, buildPath),
        assetsSubDirectory: 'static',
        assetsPublicPath: envInfo.assetsPublicPath,
        productionSourceMap: false,
        // setting to `true`, make sure to: npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // 打包分析
        bundleAnalyzerReport: false,
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/', // site root folder
        proxyTable: {
            '/dacq': {
                target: envInfo.domain,
                changeOrigin: true,
                pathRewrite: {
                    '^/dacq': '/dacq',
                },
            },
            '/shop': {
                target: envInfo.domain,
                changeOrigin: true,
                pathRewrite: {
                    '^/shop': '/shop',
                },
            },
            '/procurement': {
                target: envInfo.domain,
                changeOrigin: true,
                pathRewrite: {
                    '^/procurement': '/procurement',
                },
            },
            '/member': {
                target: envInfo.domain,
                changeOrigin: true,
                pathRewrite: {
                    '^/member': '/member',
                },
            },
        },
        cssSourceMap: false,
    },
}
