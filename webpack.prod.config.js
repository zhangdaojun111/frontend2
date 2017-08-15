/**
 * Created by xxt on 2017/7/20.
 */

const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    entry: {
        form: path.resolve(APP_PATH, 'entrys/form.js'),
        openForm: path.resolve(APP_PATH, 'entrys/popup/openForm.js'),
        addNewBuild: path.resolve(APP_PATH, 'entrys/popup/addNewBuild.js'),
        choose: path.resolve(APP_PATH, 'entrys/popup/choose.js'),
        createWorkflow: path.resolve(APP_PATH, 'entrys/createWorkflow.js'),
        approvalWorkflow: path.resolve(APP_PATH, 'entrys/approvalWorkflow.js'),
        addFocus: path.resolve(APP_PATH, 'entrys/popup/addFocus.js'),
        addSigner: path.resolve(APP_PATH, 'entrys/popup/addSigner.js'),
        dataGrid: path.resolve(APP_PATH, 'entrys/dataGrid.js'),
        customDataGrid: path.resolve(APP_PATH, 'entrys/popup/customDataGrid.js'),
        expertSearch: path.resolve(APP_PATH, 'entrys/popup/expertSearch.js'),
        sourceDataGrid: path.resolve(APP_PATH, 'entrys/popup/sourceDataGrid.js'),
        login:path.resolve(APP_PATH, 'entrys/login.js'),
        bi:path.resolve(APP_PATH, 'entrys/bi.js'),
        bimanager:path.resolve(APP_PATH, 'entrys/bimanager.js'),
        calendar: path.resolve(APP_PATH, 'entrys/calendar.js'),
        calendarSet: path.resolve(APP_PATH, 'entrys/calendar.set.js'),
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
        new webpack.optimize.CommonsChunkPlugin('vendors'),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: {
                except: ['$']
            }
        }),

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
        new OptimizeCssAssetsPlugin()
    ]
}