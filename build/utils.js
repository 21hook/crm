const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const glob = require('glob')

exports.entry = function (_path) {
    const entries = {}
    if (path !== './src/views') {
        console.log(`仅编译 ${_path} 目录下的文件`)
    }
    glob.sync(`${_path}/**/*.js`, { matchBase: true }).forEach((entry) => {
        const label = entry.replace('./src/views/', '').replace('.js', '')
        entries[label] = entry
    })
    return entries
}
exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap,
        },
    }

    function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader]
        if (loader) {
            loaders.push({
                loader: `${loader}-loader`,
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap,
                }),
            })
        }

        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader',
            })
        }
        return ['vue-style-loader'].concat(loaders)
    }

    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
    }
}

exports.styleLoaders = function (options) {
    const output = []
    const loaders = exports.cssLoaders(options)
    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp(`\\.${extension}$`),
            use: loader,
        })
    }
    return output
}
