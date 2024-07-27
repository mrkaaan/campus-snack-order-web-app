const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      // axios: 'axios',
      'element-ui': 'ELEMENT'
    },
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
})
