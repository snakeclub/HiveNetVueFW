'use strict';
// 按需加载element-plus的支持变量
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const TerserPlugin = require('terser-webpack-plugin');

// 处理路径的工具函数
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // 部署应用包时的基本URL，如果应用部署在根目录下，应设置为"/"；如果应用被部署在一个子路径上，需要用这个选项指定这个子路径
  // 例如应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/
  // 这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
  publicPath: process.env.ENV === 'prod' ? '/' : '/',

  // 运行 vue-cli-service build 时生成的生产环境构建文件的目录
  outputDir: 'dist',

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',

  // 如果觉得每次保存都检查格式很烦，可以指定在 'development' 环境不检查
  lintOnSave: true,

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,

  // 解决babel-loader默认忽略./node_modules中的文件的问题
  transpileDependencies: ['screenfull'],

  // webpack-dev-server 相关配置， 参数说明见：https://webpack.js.org/configuration/dev-server/
  devServer: {
    // 监听的服务host地址
    host: '0.0.0.0',
    // 监听端口
    port: 8081,
    // 在服务启动后自动打开浏览器
    open: true,
    // 代理配置，更多配置方式查看: https://webpack.js.org/configuration/dev-server/#devserverproxy
    proxy: {
      // 以下配置指定'/api'路径使用代理，例如/api/users的请求将访问代理：http://localhost:3000/api/users
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true // 是否需要跨域
        /**
         * 主要参数说明
         * target：要使用url模块解析的url字符串
         * forward：要使用url模块解析的url字符串
         * agent：要传递给http（s）.request的对象（请参阅Node的https代理和http代理对象）
         * ssl：要传递给https.createServer（）的对象
         * ws：true / false，是否代理websockets
         * xfwd：true / false，添加x-forward标头
         * secure：true / false，是否验证SSL Certs
         * toProxy：true / false，传递绝对URL作为路径（对代理代理很有用）
         * prependPath：true / false，默认值：true - 指定是否要将目标的路径添加到代理路径
         * ignorePath：true / false，默认值：false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须附加/手动）。
         * localAddress：要为传出连接绑定的本地接口字符串
         * changeOrigin：true / false，默认值：false - 将主机标头的原点更改为目标URL
         */
      }
    },
    // 解决本地服务不能通过ip访问的问题
    disableHostCheck: true,
    // 错误在页面弹出，警告不在页面中弹出
    overlay: {
      warnings: false,
      errors: true
    }
  },

  //  配置webpack，所配置的参数将通过 webpack-merge 合并入最终的 webpack 配置
  configureWebpack: {
    name: process.env.VUE_APP_TITLE, // 项目名称

    // element-plus安装最新版本跑不起来，需要增加这个配置
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    },

    resolve: {
      // 别名快捷引用，将自动将别名替换为设置值
      alias: {
        '@': resolve('src'), // 将内容中的 @ 自动替换为 path.join(__dirname, 'src') 的路径结果
        '@mockIdPath': resolve('src') + '/api/mock/' + process.env.MOCK_ID // 加载mock配置的目录, 在打包时进行替换, 解决require.context入参不支持变量的问题
      }
    },

    // 按需加载element-plus的配置
    plugins: [
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],

    // 压缩优化器，打包时删除console.log代码
    optimization: {
      minimize: process.env.ENV !== 'dev', // 开发环境不压缩
      minimizer: [new TerserPlugin({
        // 配置参考https://www.jianshu.com/p/4ce8e2247033
        cache: true, // 是否缓存
        parallel: true, // 是否并行打包
        sourceMap: true,
        extractComments: true, // 是否将注释提取到一个单独的文件中，例如原始文件名为foo.js，则注释将存储到foo.js.LICENSE.txt
        terserOptions: {
          mangle: true, // 是否混淆代码(默认为false)，注意如果代码有使用eval，则使用混淆很有可能导致代码失效
          compress: {
            drop_console: true, // 删除console.*代码
            drop_debugger: true, // 删除debugger
            pure_funcs: ['console.log']
          },
          format: {
            comments: false
          }
        }
      })]
    },

    // 支持调试
    devtool: 'source-map'
  },

  // Vue CLI 内部的 webpack 配置是通过 webpack-chain 维护的。这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改
  chainWebpack: config => {
    /** 这段配置运行存在问题
    // 提前预加载提高切换路由的体验
    config.plugins('preload').tap(() => [
      {
        ref: 'preload',
        // 把runtime代码的 preload 去掉
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        inlude: 'initial'
      }
    ]);
    */
    // 删除预获取页面的配置，如果页面比较多，开启预获取会增加很多无用请求
    config.plugins.delete('prefetch');

    // 设置 svg-sprite-loader, 自动加载 svg 资源
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')) // 加载的svg图片目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // 生产环境打包的优化配置
    config
      .when(process.env.ENV !== 'dev',
        config => {
          // chunks 资源分块, 指定某些资源单独打包
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                },
                'element-plus': {
                  name: 'chunk-element-plus',
                  test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                  chunks: 'initial',
                  priority: 3,
                  reuseExistingChunk: true,
                  enforce: true
                }
              }
            });

          // 设定runtime代码单独抽取打包
          config.optimization.runtimeChunk('single');
        }
      );

    // 复制静态文件到打包环境, 必须放在最后处理才能生效
    config.plugin('copy')
      .use(
        require('copy-webpack-plugin'),
        [[
          // 复制robot.txt文件到网站根目录
          {
            from: path.resolve(__dirname, './public/robots.txt'), // 防爬虫文件
            to: './' // 到根目录下
          },
          // 复制非引用类的静态文件到打包环境static
          {
            from: path.resolve(__dirname, './static'),
            to: './static'
          },
          // 复制md文档到打包环境, 仅demo使用
          {
            from: path.resolve(__dirname, './docs/**/*.md'),
            to: './[path][name].[ext]',
            toType: 'template'
          },
          // 复制md文档的图片及附件到打包环境, 仅demo使用
          {
            from: path.resolve(__dirname, './docs/images'),
            to: './docs/images'
          }
        ]]
      );
  }
};
