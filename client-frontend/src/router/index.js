import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/order-history',
    name: 'orderHistory',
    component: () => import('@/views/OrderHistory.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/UserProfile.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
