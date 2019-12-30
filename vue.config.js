var urlConfig = require('./url.config.js');
const path = require('path');
const resolve = function (dir) {
  return path.join(__dirname, dir);
};

module.exports = {
  pages: {
    index: {
      entry: './src/main.js',
      template: './public/index.html',
      filename: 'index.html'
    },

    versionDetails: {
      entry: './src/pages/version-details/main.js',
      template: './public/index.html',
      filename: 'versionDetails.html'
    }
  },

  css: {
    // 让样式找到源
    sourceMap: true,
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      // 引入全局样式变量
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/var.scss'),
        path.resolve(__dirname, 'src/assets/styles/mixin.scss')
      ]
    }
  },

  // 打包后是否去掉打印语句
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = false;
    }
  },

  // 别名设置
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'));
  },

  publicPath: '/portal',

  // 使用 lintOnSave: 'error'。这会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败
  // 设置为 true 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
  lintOnSave: process.env.NODE_ENV !== 'production',

  devServer: {
    hot: true,
    // 配置 eslint 错误显示在控制台上
    clientLogLevel: 'warning',
    proxy: {
      [urlConfig.axiosBaseURL]: {
        target: urlConfig.proxyTarget,
        secure: false,
        changeOrigin: true,
        pathRewrite: { [`^${urlConfig.axiosBaseURL}`]: '' }
      }
    }
  }
};