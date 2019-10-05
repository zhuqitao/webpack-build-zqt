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
 *      冒烟测试、单元测试、测试覆盖率、测试覆盖率
 *      持续集成
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
