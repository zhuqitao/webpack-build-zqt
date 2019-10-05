/**
 * 冒烟测试
 */

const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');   // 删除目录插件

// chdir修改当前工作目录
process.chdir(path.join(__dirname, 'template'));    

rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod.js');
    // 执行webpack.prod.js
    webpack(prodConfig, (err, stats) => {
        if (err) {
            console.log(err);
            process.exit(2);
        }
        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false
        }))
    })
})