/*
 * @Author: zengzijian
 * @Date: 2019-08-24 09:40:20
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-26 11:45:26
 * @Description: 
 */
const express = require("express")
const webpack = require("webpack")
const opn = require('opn')
const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackHotMiddleware = require("webpack-hot-middleware")
const webpackConfig = require('../webpack.config.js')
const compress = require('compression')
const app = express()
const port = 8081
const compiler = webpack(webpackConfig)
const project = require('../project.config')

app.use(compress())

const devMiddleware = webpackDevMiddleware(compiler, {
    quiet   : false,
    noInfo  : false,
    lazy    : false,
    headers : {'Access-Control-Allow-Origin': '*'},
    stats   : 'errors-only',
})

devMiddleware.waitUntilValid(()=>{
    opn("http://localhost:"+ port)
})

const hotMiddleware = webpackHotMiddleware(compiler, {
    path : '/__webpack_hmr',
    log  : false
})

app.use(devMiddleware)
app.use(hotMiddleware)
app.use(express.static(project.basePath))
module.exports = {
    app,
    port
}