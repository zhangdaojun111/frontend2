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

    devtool: 'cheap-module-eval-source-map',

    entry: [
        // 'webpack/hot/dev-server',
        // 'webpack-hot-middleware/client',
        APP_PATH
    ],

    entry: {
        form: path.resolve(APP_PATH, 'entrys/form.js'),
        openForm: path.resolve(APP_PATH, 'entrys/popup/openForm.js'),
        choose: path.resolve(APP_PATH, 'entrys/popup/choose.js'),
        createWorkflow: path.resolve(APP_PATH, 'entrys/createWorkflow.js'),
        approvalWorkflow: path.resolve(APP_PATH, 'entrys/approvalWorkflow.js'),
        addSigner: path.resolve(APP_PATH, 'entrys/popup/addSigner.js'),
        addfocus: path.resolve(APP_PATH, 'entrys/popup/addfocus.js'),
        addWf: path.resolve(APP_PATH, 'entrys/popup/addWf.js'),
        approvalDialog:path.resolve(APP_PATH, 'entrys/popup/approvalDialog.js'),
        multiapp: path.resolve(APP_PATH, 'entrys/popup/multiapp.js'),
        login:path.resolve(APP_PATH, 'entrys/login.js'),
        dataGrid: path.resolve(APP_PATH, 'entrys/dataGrid.js'),
        sourceDataGrid: path.resolve(APP_PATH, 'entrys/popup/sourceDataGrid.js'),
        dataImport: path.resolve(APP_PATH, 'entrys/popup/dataImport.js'),
        expertSearch: path.resolve(APP_PATH, 'entrys/popup/expertSearch.js'),
        historyApprove: path.resolve(APP_PATH, 'entrys/popup/historyApprove.js'),
        operationDetails: path.resolve(APP_PATH, 'entrys/popup/operationDetails'),
        jurisdiction: path.resolve(APP_PATH, 'entrys/popup/jurisdiction'),
        workflowPage: path.resolve(APP_PATH, 'entrys/popup/workflowPage.js'),
        rowOperation: path.resolve(APP_PATH, 'entrys/popup/rowOperation.js'),
        customDataGrid: path.resolve(APP_PATH, 'entrys/popup/customDataGrid.js'),
        bi:path.resolve(APP_PATH, 'entrys/bi.js'),
        bimanager:path.resolve(APP_PATH, 'entrys/bimanager.js'),
        calendar: path.resolve(APP_PATH, 'entrys/calendar.js'),
        calendarSet: path.resolve(APP_PATH, 'entrys/calendar.set.js'),
        calendarSetRemind: path.resolve(APP_PATH, 'entrys/popup/calendarSetRemind.js'),
        calendarCreate: path.resolve(APP_PATH, 'entrys/calendar.create.js'),
        calendarOpenSetting: path.resolve(APP_PATH, 'entrys/popup/calendarOpenSetting.js'),
        calendarExport: path.resolve(APP_PATH, 'entrys/popup/calendarExport.js'),
        main: path.resolve(APP_PATH, 'entrys/main.js'),
        register:path.resolve(APP_PATH, 'entrys/register.js'),
        resultDisplay:path.resolve(APP_PATH,'entrys/resultDisplay.js'),
        findPassword:path.resolve(APP_PATH,'entrys/findPassword.js'),
        vendors: [
            'jquery',
            'jquery-ui',
            'jquery-ui/themes/base/base.css',
            'jquery-ui/themes/base/theme.css',
            'mediator-js',
            'handlebars',
            'lodash',
            'babel-polyfill'
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
            },
        ]
    },

    plugins: [
        // new webpack.HotModuleReplacementPlugin()
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks: 3
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
}