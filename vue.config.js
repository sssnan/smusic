const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  // 关闭ESlint
  lintOnSave: false,
  // 开启代理服务器
  devServer: {
    proxy: "https://netease-cloud-music-api-phi-silk.vercel.app/",
  },
  // 自动引入element-plus组件
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
}
