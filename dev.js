var express = require('express');
var webpack = require('webpack');
var WebpackDevMiddleware = require('webpack-dev-middleware');
var WebpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.dev.config');
var compiler = webpack(config);

app = express();
app.set('views', './template');
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
}));
// app.use(WebpackHotMiddleware(compiler))

var router = express.Router();
router.get('/', function (req, res, next) {
    console.log('xxx');
    res.render('index', { message: 'Hey there!'});
});
app.use(router);

app.listen(8080, function () {
    console.log('Listening on 8080')
});