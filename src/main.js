import { createApp } from 'vue'
import App from './App.vue'
// 全局组件
import Header from '@/components/Header'
import Menu from '@/components/Menu'
import Pagination from '@/components/Pagination'
// vuex
import store from './store'
// 路由组件
import router from './router'
// 自定义插件
import util from '@/utils/util'
// 参数
import params from '@/assets/js/params'
// 引入全局样式
import "@/assets/fonts/iconfont.css"
import "@/assets/css/base.css"

const app = createApp(App)
// 全局配置 相当于 Vue.prototpe
app.config.globalProperties['$utils'] = util;
app.config.globalProperties['$params'] = params;

// 注册插件 / 全局组件
app.use("Header", Header)
app.use("Menu", Menu)
app.use("Pagination", Pagination)
app.use(store)
app.use(router)

app.mount('#app')
