/**
 * Created by xxt on 2017/7/20.
 */

const path = require('path');
var argv = require('yargs').argv;
var express = require('express');
var webpack = require('webpack');
var WebpackDevMiddleware = require('webpack-dev-middleware');
var WebpackHotMiddleware = require('webpack-hot-middleware');
var HtmlWebpackPlugin = require('html-webpack-plugin');

require("babel-polyfill");

//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');

var customType = argv.env && argv.env.path;
var customEntrys = {};


try {
    console.info("loading custom entrys config");
    customEntrys = require(`./custom/${customType}/entrys.config.js`);
} catch (e) {
    console.info("ERROR: loading default entrys config");
    customEntrys = require('./entrys.config.js');
}

module.exports = {

    devtool: 'cheap-module-eval-source-map',

    entry: Object.assign(customEntrys, {
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
    }),

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
                                ["env"]
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
};