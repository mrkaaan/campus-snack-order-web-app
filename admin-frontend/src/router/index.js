import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'
import OrderManagement from '@/views/OrderManagement.vue'
import MerchantManagement from '@/views/MerchantManagement.vue'
import userManagement from '@/views/UserManagement.vue'
import userFeedback from '@/views/UserFeedback.vue'
import systemSettings from '@/views/SystemSettings.vue'
import dashboard from '@/views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: { path: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        component: dashboard
      },
      {
        path: 'order',
        component: OrderManagement
      },
      {
        path: 'merchant',
        component: MerchantManagement
      },
      {
        path: 'user',
        component: userManagement
      },
      {
        path: 'free-back',
        component: userFeedback
      },
      {
        path: 'system',
        component: systemSettings
      }
    ]
  }
]

// 重写push
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
// })

export default router
