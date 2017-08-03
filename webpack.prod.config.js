/**
 * Created by xxt on 2017/7/20.
 */

const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    entry: {
        bi: path.resolve(APP_PATH, 'entrys/bi.js'),
        vendors: [
            'jquery',
            'jquery-ui',
            'jquery-ui/themes/base/base.css',
            'jquery-ui/themes/base/theme.css',
            'mediator-js',
            'handlebars',
            'moment',
            'lodash',
            'babel-polyfill'
        ]
    },

    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader:"babel-loader",
                        options:{
                            presets:[
                                ["es2015", 'stage-3']
                            ]
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/[name].css');
            },
            allChunks: true
        })
    ]
}