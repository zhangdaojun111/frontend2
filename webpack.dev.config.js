/**
 * Created by xxt on 2017/7/20.
 */

const path = require('path');
var express = require('express');
var webpack = require('webpack');
var WebpackDevMiddleware = require('webpack-dev-middleware');
var WebpackHotMiddleware = require('webpack-hot-middleware');
var HtmlWebpackPlugin = require('html-webpack-plugin');

require("babel-polyfill");

//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');

module.exports = {

    devtool: 'eval-source-map',

    // entry: [
    //     // 'webpack/hot/dev-server',
    //     // 'webpack-hot-middleware/client',
    //     APP_PATH
    // ],

    entry: {
        form: path.resolve(APP_PATH, 'entrys/form.js'),
        openForm: path.resolve(APP_PATH, 'entrys/popup/openForm.js'),
        addNewBuild: path.resolve(APP_PATH, 'entrys/popup/addNewBuild.js'),
        choose: path.resolve(APP_PATH, 'entrys/popup/choose.js'),
        createWorkflow: path.resolve(APP_PATH, 'entrys/createWorkflow.js'),
        approvalWorkflow: path.resolve(APP_PATH, 'entrys/approvalWorkflow.js'),
        addFocus: path.resolve(APP_PATH, 'entrys/popup/addFocus.js'),
        addSigner: path.resolve(APP_PATH, 'entrys/popup/addSigner.js'),
        login:path.resolve(APP_PATH, 'entrys/login.js'),
        dataGrid: path.resolve(APP_PATH, 'entrys/dataGrid.js'),
        sourceDataGrid: path.resolve(APP_PATH, 'entrys/popup/sourceDataGrid.js'),
        customDataGrid: path.resolve(APP_PATH, 'entrys/popup/customDataGrid.js'),
        bi:path.resolve(APP_PATH, 'entrys/bi.js'),
        bimanager:path.resolve(APP_PATH, 'entrys/bimanager.js'),
        calendar: path.resolve(APP_PATH, 'entrys/calendar.js'),
        calendarSet: path.resolve(APP_PATH, 'entrys/calendar.set.js'),
        calendarSetRemind: path.resolve(APP_PATH, 'entrys/popup/calendarSetRemind.js'),
        calendarCreate: path.resolve(APP_PATH, 'entrys/calendar.create.js'),
        main: path.resolve(APP_PATH, 'entrys/main.js'),
        vendors: [
            'jquery',
            'jquery-ui',
            'jquery-ui/themes/base/base.css',
            'jquery-ui/themes/base/theme.css',
            'mediator-js',
            'handlebars',
            'moment',
            'lodash',
            'babel-polyfill',
            'jsplumb'
        ]
    },

    output: {
        path: '/',
        publicPath: 'http://localhost:8080/scripts/',
        filename: '[name].js'
    },

    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }, {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 20000,
                        name: 'images/[hash:12].[ext]'
                    }
                }]
            }, {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }],
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                ["latest"]
                            ]
                        }
                    }
                ]
            },{
                test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                exclude: /node_modules/,
                loader: 'url-loader'
            },
        ]
    },

    plugins: [
        // new webpack.HotModuleReplacementPlugin()
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.optimize.CommonsChunkPlugin('vendors'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
}