/**
 * Created by xxt on 2017/7/20.
 */

const path = require('path');
var argv = require('yargs').argv;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');

//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

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

    devtool: 'cheap-module-source-map',

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
        path: BUILD_PATH,
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        // 'css-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                alias: {
                                    "core.css": "./core.css",
                                    "accordion.css": "./accordion.css",
                                    "autocomplete.css": "./autocomplete.css",
                                    "button.css": "./button.css",
                                    "checkboxradio.css": "./checkboxradio.css",
                                    "controlgroup.css": "./controlgroup.css",
                                    "datepicker.css": "./datepicker.css",
                                    "dialog.css": "./dialog.css",
                                    "draggable.css": "./draggable.css",
                                    "menu.css": "./menu.css",
                                    "progressbar.css": "./progressbar.css",
                                    "resizable.css": "./resizable.css",
                                    "selectable.css": "./selectable.css",
                                    "selectmenu.css": "./selectmenu.css",
                                    "sortable.css": "./sortable.css",
                                    "slider.css": "./slider.css",
                                    "spinner.css": "./spinner.css",
                                    "tabs.css": "./tabs.css",
                                    "tooltip.css": "./tooltip.css"
                                }
                            }
                        },
                        'postcss-loader'
                    ]
                }),
                // include: path.join(__dirname, "app"),
                // exclude: /node_modules/
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        // 'css-loader',
                        {loader: 'css-loader'},
                        'postcss-loader',
                        'sass-loader'
                    ]
                }),
                // include: path.join(__dirname, "app"),
                // exclude: /node_modules/
            }, {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 20000,
                        publicPath: '../',
                        name: '/images/[hash:12].[ext]'
                    }
                }]
            }, {
                test: /\.html$/,
                use: [{
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
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks: 3
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     minimize: true,
        //     mangle: {
        //         except: ['$']
        //     }
        // }),

        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/[name].css');
            },
            allChunks: false
        }),
        new ImageminPlugin({
            pngquant: {
                quality: '60'
            }
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                safe: true
            }
        })
    ]
}