import * as path from 'path';
import * as webpack from 'webpack';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const ASSET_PATH = 'assets';
const devMode = process.env.NODE_ENV !== 'production';

const config: webpack.Configuration = {
    mode: devMode ? 'development' : 'production',
    devtool: 'source-map',
    cache: true,
    recordsPath: path.join(__dirname, '.records'),
    entry: {
        app: './src/app.ts'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: `${ASSET_PATH}/[name].[hash].js`,
        chunkFilename: `${ASSET_PATH}/[id].[hash].js`
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.(png|jpe?g|svg|gif|ttf|woff2?|eot|ogg|mp3|wav|json)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: devMode,
                            optipng: {
                                optimizationLevel: 7,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        // don't emit output when there are errors
        new webpack.NoEmitOnErrorsPlugin(),

        // extract inline css into separate 'styles.css'
        new MiniCssExtractPlugin({
            filename: `[name].[hash].css`,
            chunkFilename: '[id].[hash].css',
        }),

        // create app html
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './assets/index.ejs',
            title: 'LTTP',
            chunks: ['vendor', 'app'],
            cache: true
        }),
    ],
};

export default config;
