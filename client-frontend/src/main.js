import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import CryptoJS from 'crypto-js'
// import service from './utils/request'
import './plugins/element.js'
import './styles/global.scss'
import 'tailwindcss/tailwind.css'
// Vue.prototype.$service = service

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$CryptoJS = CryptoJS
