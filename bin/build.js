const webpack = require('webpack')
const ora = require('ora')
const webpackConfig = require('../webpack.config')

const spinner = new ora('Webpack is compiling ...\n')

switch (process.env.type) {
    case 'test':
        console.log("当前打包构建的gateway环境是：test");
        break;
    case 'test2':
        console.log("当前打包构建的gateway环境是：test2");
        break;
    case 'production':
        console.log("当前打包构建的gateway环境是：production");
        break;
    default:
        console.log("当前打包构建的gateway环境未定义");
        break;
}

spinner.color = 'green'
spinner.start()

webpack(webpackConfig).run((err, stats) => {
    if (err) {
        console.log('Webpack compile failure')
    } else {
        spinner.stop()
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')


        console.log('Webpack compiler finished successfully！ See ./dist.');
        var date = new Date();
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        console.log(Y + M + D + h + m + s);
    }
})


