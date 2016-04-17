const path = require('path');
const SplitByPathPlugin = require('webpack-split-by-path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'production';
const isProduction = env === 'production';

module.exports = {
    entry: {
        game: [path.join(__dirname, 'src', 'js')]
    },
    output: {
        path: path.join(__dirname, 'cordova', 'www', 'js'),
        publicPath: '/js',
        filename: `[name]${isProduction ? '.[chunkhash]' : ''}.js`,
        pathinfo: !isProduction
    },
    devServer: {
        contentBase: path.join(__dirname, 'cordova', 'www'),
        inline: true,
        // host: '192.168.1.145'
    },
    devtool: 'eval-source-map',
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new SplitByPathPlugin([{
            name: 'vendor',
            path: path.join(__dirname, 'node_modules')
        }]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': `"${env}"`
            },
            '__PLATFORM__': '"ios"',
            '__DEV__': !isProduction
        }),
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
        }),
        new HtmlWebpackPlugin({
            title: 'LD35 - Boats!',
            filename: '../index.html'
        })
    ],
    module: {
        loaders: [
            { test: /\.json$/, exclude: /node_modules/, loader: 'json' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
        ]
    }
};

if (isProduction) {
    module.exports.plugins
        .push(new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false
        }));
    module.exports.devtool = null;
}
