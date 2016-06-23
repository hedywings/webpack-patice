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
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: PATHS.app,
                loader: 'react-hot',
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: [ 'react', 'es2015' ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            title: 'webpack demo',
            template: 'index.ejs'
        })
    ]
};

switch (process.env.npm_lifecycle_event) {
    case 'stats':
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
            // parts.extractCSS(PATHS.style),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT
            })
        );
}

module.exports = validate(config);