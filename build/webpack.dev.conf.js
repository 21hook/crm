const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const { envInfos } = require('../config/env.pramas')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const file = utils.entry(process.env.source)
const platform = envInfos

const dev = {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
            'process.env.API_ROOT': `"${platform[process.env.build_env].domain}"`,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin(),
    ],
}
console.log('files')
console.log(file)
for (const one in file) {
    dev.plugins.push(new HtmlWebpackPlugin({
        filename: `${one}.html`,
        template: 'index.html',
        chunks: [one],
        inject: true,
    }))
}

Object.keys(baseWebpackConfig.entry).forEach((name) => {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, dev)
