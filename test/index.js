
/**
 * 单元测试
 *  测试入口文件
 */
/**
 * 测试覆盖率
 *  借助istanbul
 *  在scripts命令test中添加 istanbul cover 参数
 */

const path = require('path');

process.chdir(path.join(__dirname, 'smoke/template'));

describe('builder-webpack test case', () => {
    require('./unit/webpack-base-test');
});