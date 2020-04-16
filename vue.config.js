'use strict'
const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin')
const { styles } = require('@ckeditor/ckeditor5-dev-utils')
const defaultSettings = require('./src/settings.js')

const resolve = dir => path.join(__dirname, dir)

const name = defaultSettings.title || 'Vue-Admin' // page title

const port = process.env.port || process.env.npm_config_port || 8080 // dev port

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/admin' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/api/v1/upload': {
        target: 'http://oss.test.jianying.run',
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: 'http://sandu.test.jianying.run',
        changeOrigin: true,
        ws: true,
      },
      // [process.env.VUE_APP_BASE_API]: {
      //   target: `http://127.0.0.1:${port}/mock`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + process.env.VUE_APP_BASE_API]: '',
      //   },
      // },
    },
    after: require('./mock/mock-server.js'),
  },
  transpileDependencies: [/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/],
  //默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  configureWebpack: config => {
    config.name = name
    const plugins = []
    plugins.push(
      new LodashModuleReplacementPlugin({
        collections: true,
        shorthands: true,
        chaining: true,
      })
    )
    // CKEditor needs its own plugin to be built using webpack.
    plugins.push(
      new CKEditorWebpackPlugin({
        language: 'zh-cn',
      })
    )
    config.plugins = [...config.plugins, ...plugins]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/styles/variables.scss";
          @import "~@/styles/mixin.scss";
        `,
      },
    },
  },
  chainWebpack(config) {
    // Vue CLI通常使用自己的加载器来加载.svg和.css文件，但是:
    // CKEditor使用的图标必须使用raw-loader加载，
    // CKEditor使用的CSS必须使用PostCSS进行转换才能正确加载。
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'))
    // Add an entry for *.svg files belonging to CKEditor.
    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader')
    // (2.) Transpile the .css files imported by the editor using PostCSS.
    // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
    config.module
      .rule('cke-css')
      .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
      .use('postcss-loader')
      .loader('postcss-loader')
      .tap(() => {
        return styles.getPostCssConfig({
          themeImporter: {
            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
          },
          minify: true,
        })
      })
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    // https://webpack.js.org/configuration/devtool/#development
    // config.when(process.env.NODE_ENV === 'development', config =>
    //   config.devtool('source-map')
    // )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          echarts: {
            name: 'chunk-echarts',
            priority: 30,
            test: /[\\/]node_modules[\\/]_?echarts(.*)/,
          },
          quill: {
            name: 'chunk-quill',
            priority: 40,
            test: /[\\/]node_modules[\\/]_?quill(.*)/,
          },
          xlsx: {
            name: 'chunk-xlsx',
            priority: 50,
            test: /[\\/]node_modules[\\/]_?xlsx(.*)/,
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      config.optimization.runtimeChunk('single')
    })
  },
}
