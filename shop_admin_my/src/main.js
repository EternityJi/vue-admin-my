// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import echarts from 'echarts'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
var ElTreeGrid = require('element-tree-grid')
Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(iView)
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(config => {
  var token = JSON.parse(localStorage.getItem('userInfo'))
  console.log(token)
  if (token) {
    config.headers.Authorization = token.token
  }

  return config
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
