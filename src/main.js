import Vue from 'vue' // 引入vue

import 'normalize.css/normalize.css' // 一个现代替代CSS重置

import ElementUI from 'element-ui' // 饿了么UI
import 'element-ui/lib/theme-chalk/index.css' // 饿了么UI 全局样式

import 'tailwindcss/tailwind.css' // tailwind css 样式
import '@/styles/index.scss' //全局 css 样式

import '@/utils/directive.js' // 自定义指令
import App from './App.vue' // 导入根主件
import store from './store' // vuex 存储
import router from './router' // 路由

import '@/icons' // icon 图标
import 'virtual:svg-icons-register' // svg-register 注册
import '@/permission' // 权限 管理
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

import PrintNb from 'vue-print-nb' //打印功能
Vue.use(PrintNb)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
import { chatTitleAPI, enterpriseDataAPI } from '@/api/charts'