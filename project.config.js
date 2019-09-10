/* eslint-disable no-unused-vars */
/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:33:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 10:29:46
 * @Description: 根据环境不同，采用不同的请求配置
 */

const development = {
    gwApiPrefix: 'http://192.168.0.99:7081',
    wsApiPrefix: 'ws://192.168.0.99:7081',
}

const huawei = {
    gwApiPrefix: 'http://58.255.93.170:28307',
    wsApiPrefix: 'ws://58.255.93.170:28307',
}

const developmentTest = {
    gwApiPrefix: 'http://192.168.0.99:6081',
    wsApiPrefix: 'ws://192.168.0.99:6081',
}

const production = {
    // gwApiPrefix: 'http://192.168.0.72:7081',
    gwApiPrefix: '',
    wsApiPrefix: '',
}

const test = {
    gwApiPrefix: '',
    wsApiPrefix: 'ws://192.168.0.99:7081',
}

const test2 = {
    gwApiPrefix: '',
    wsApiPrefix: 'ws://192.168.0.99:6081',
}

const huanjia = {
    gwApiPrefix: 'http://192.168.0.123:7081',
    wsApiPrefix: 'ws://192.168.0.123:7081',
}

const huanjiaTest = {
    gwApiPrefix: 'http://192.168.0.123:6081',
    wsApiPrefix: 'ws://192.168.0.123:6081',
}

const mingxing = {
    gwApiPrefix: 'http://192.168.0.113:7081',
    wsApiPrefix: 'ws://192.168.0.113:7081',
}

const weidong = {
    gwApiPrefix: 'http://192.168.0.110:7081',
    wsApiPrefix: 'ws://192.168.0.110:7081',
}

const quanwei = {
    gwApiPrefix: 'http://192.168.0.124:7081',
    wsApiPrefix: 'ws://192.168.0.124:7081',
}

const yilun = {
    gwApiPrefix: 'http://192.168.0.119:7081',
    wsApiPrefix: 'ws://192.168.0.119:7081',
}

const zhuolin = {
    gwApiPrefix: 'http://192.168.0.125:7081',
    wsApiPrefix: 'ws://192.168.0.125:7081',
}

const yuefei = {
    gwApiPrefix: 'http://192.168.0.111:7081',
    wsApiPrefix: 'ws://192.168.0.111:7081',
}

const developmentTest_2_0 = {
    gwApiPrefix: 'http://192.168.0.99:5081',
    wsApiPrefix: 'ws://192.168.0.99:5081',
}

const yongjian = {
    gwApiPrefix: 'http://192.168.0.109:7081',
    wsApiPrefix: 'ws://192.168.0.109:7081',
}

const poc_yuefei = {
    gwApiPrefix: 'http://96.0.192.78:1874',
    wsApiPrefix: 'ws://96.0.192.78:1874',
}

var httpResult;


switch (process.env.type) {
    case 'development'://此处切换后端接口ip端口
        // httpResult = huanjiaTest;
        // httpResult = huanjia;
        // httpResult = mingxing;
        // httpResult = development;
        // httpResult = yongjian;
        // httpResult = huawei;
        // httpResult = quanwei;
        // httpResult = developmentTest;
        // httpResult = weidong;
        // httpResult = yilun;
        // httpResult = yuefei;
        // httpResult = zhuolin
        // httpResult = developmentTest_2_0;
        httpResult = poc_yuefei;
        break;
    case 'test':
        httpResult = test;
        break;
    case 'test2':
        httpResult = test2;
        break;
    case 'production':
        httpResult = poc_yuefei;
        break;

    default:
        httpResult = development;
        break;
}
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV)
module.exports = {
    env: NODE_ENV,
    basePath: __dirname,
    srcDir: 'src',
    outDir: 'dist',
    publicPath: './',
    sourceMap: NODE_ENV == 'development' ? true : false,
    externals: {},
    vendor: [
        // "@antv/data-set",
        // "@antv/g2",
        // "@antv/g6-editor",
        "antd",
        "axios",
        "babel-polyfill",
        "codemirror",
        "crypto-js",
        // "echarts",
        // "extract-text-webpack-plugin",
        // "jquery",
        "js-cookie",
        // "layui-layer",
        "mobx",
        "mobx-react",
        "promise",
        "rc-color-picker",
        "react-codemirror2",
        "react-dnd",
        "react-dnd-html5-backend",
        "react-dom",
        "react-loadable",
        "react-router-dom",
        "viser-react",
    ],
    http: httpResult,
    mock: true
}
