import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import CryptoJS from 'crypto-js'
import './plugins/element.js'
import './styles/global.scss'
import 'tailwindcss/tailwind.css'

// // 初始化用户认证状态，忽略返回的 Promise
// store.dispatch('auth/initializeAuth')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$CryptoJS = CryptoJS
