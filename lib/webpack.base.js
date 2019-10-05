/**
 * 构建配置包设计
 */

/**
 * 构建配置抽离成npm包的意义
 *  通用性
 *      业务开发者无需关心构建配置
 *      统一团队构建脚本
 *  可维护性
 *      构建配置合理的拆分
 *      README文档、ChangeLog文档
 *  质量
 *      冒烟测试、单元测试、测试覆盖率
 *        代码在test目录下
 *      持续集成
 */

/**
 * 持续集成，核心措施是代码集成到主干之前、必须通过自动化测试
 *  快速发现错误（git commit）
 *  防止分支大幅偏离主干
 * 
 *  流行的CI库（github排名）
 *    TravisCI、CircleCI、JenkinsCI...，本章节使用TravisCI
 */  

/**
 * TravisCI 使用方法
 *  1、https://travis-ci.org/ 使用github账号登录
 *  2、在https://travis-ci.org/account/repositories/ 开启项目权限
 *  3、在项目根目录下.travis.yml配置文件，可以监听git commit然后执行CI脚本
 */

/**
 * 可选的方案
 *  通过多个配置文件管理不同环境的构建 webpack.dev.js prod.js
 *  将构建配置设置成一个库，比如：hjs-webpack、Neutrino、webpack-blocks，结合第一条，适用于规模比较小团队
 *  抽离一个工具管理，比如： create-react-app、kyt、nwt, 适合规模比较大的团队
 *  将所有的配置放在同一个文件，通过 --env 参数控制
 */

/**
 * 本章节具体的设计方案
 *  通过多个配置文件管理不同环境的构建，借助webpack-merge组合配置
 *      基础配置：webpack.base.js
 *      开发环境：webpack.dev.js
 *      生产环境：webpack.prod.js
 *      ...
 * 抽离成一个包，并发布到npm
 *      规范：Git commit 日志、README、ESLint规范、Semver版本发布的规范
 *      质量：冒烟测试、单元测试、测试覆盖率和CI
 */


/**
 * base.js
 *  资源解析： ES6、React、Css、Less、图片、字体
 *  样式增强： Css前缀补齐、px转rem
 *  构建目录清理
 *  多页面打包
 *  命令行信息显示优化
 *  错误捕获和处理
 *  css提取成单独文件
 */

const autoprefixer = require('autoprefixer');
const glob = require('glob');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const projectRoot = process.cwd();

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      // '/Users/cpselvis/my-project/src/index/index.js'

      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];

      entry[pageName] = entryFile;
      return htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          inlineSource: '.css$',
          template: path.join(projectRoot, `./src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['vendors', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        })
      );
    });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only',
};

