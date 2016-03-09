/*eslint-env node*/
'use strict';

const path                  = require('path');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const CommonsChunkPlugin    = require('webpack/lib/optimize/CommonsChunkPlugin');
const NoErrorsPlugin        = require('webpack/lib/NoErrorsPlugin');

const ASSET_PATH = 'assets';
const VENDOR_PATH = path.join(__dirname, '/vendor');

const phaser = path.join(VENDOR_PATH, 'phaser.js');
const pixi = path.join(VENDOR_PATH, 'pixi.js');
const p2 = path.join(VENDOR_PATH, 'p2.js');

module.exports = {
    devtool: 'source-map',
    devServer: {
        port: 8000
    },
    recordsPath: path.join(__dirname, '.records'),
    entry: {
        app: './src/app.ts',
        vendor: ['pixi.js', 'p2', 'phaser', 'phaser-tiled']
    },
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: `${ASSET_PATH}/[chunkhash].js`,
        chunkFilename: `${ASSET_PATH}/[id].[chunkhash].js`
    },
    resolve: {
        extensions: ['', '.ts', '.js'],
        alias: {
            'pixi.js': pixi,
            'p2': p2,
            'phaser': phaser,
        }
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /(pixi|phaser|p2).js/,
                loader: 'script'
            },
            {
                test: /\.(png|jpe?g|svg|gif|ttf|woff2?|eot|ogg|mp3|wav|json)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                loaders: [
                    `file?name=${ASSET_PATH}/[hash].[ext]`,
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    // activate source maps via loader query
                    'css?sourceMap!less?sourceMap',
                    { allChunks: true }
                )
            }
        ]
    },
    plugins: [
        // don't emit output when there are errors
        // new NoErrorsPlugin(),

        // extract inline css into separate 'styles.css'
        new ExtractTextPlugin(`${ASSET_PATH}/[hash].css`),

        // extract shared dependencies to a central bundle
        new CommonsChunkPlugin({
            name: 'vendor',

            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
            minChunks: Infinity
        }),

        // create app html
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './assets/index.ejs',
            title: 'LTTP',
            chunks: ['vendor', 'app'],
            cache: true
        })
    ]
};
