var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    merge = require('webpack-merge'),
    validate = require('webpack-validator');

var parts = require('./lib/parts');

var PATHS = {
    app: path.join(__dirname, 'app'),
    style: path.join(__dirname, 'app', 'main.css'),
    build: path.join(__dirname, 'build')
};

var config = {};
var common = {
    entry: {
        style: PATHS.style,
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].[hash].js',
        chunkFilename: '[hash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({ title: 'webpack demo' })
    ]
};

switch (process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(common, 
            { devtool: 'source-map' },
            parts.clean(PATHS.build),
            parts.setFreeVariable('process.env.NODE_ENV', 'production'),
            parts.extractBundle({ name: 'vendor', entries: ['react'] }),
            parts.minify(),
            // parts.setupCSS(PATHS.app),
            parts.extractCSS(PATHS.style)
        );
        break;
    default:
        config = merge(common, 
            { devtool: 'eval-source-map' },
            parts.setupCSS(PATHS.app),
            parts.extractCSS(PATHS.style),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT
            })
        );
}

module.exports = validate(config);