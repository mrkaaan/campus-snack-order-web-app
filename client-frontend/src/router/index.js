import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // component: () => import('@/views/MainLayout.vue'), // 更改为新的布局组件名
    component: () => import('@/views/initialPage.vue'), // 更改为新的布局组件名
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomePage.vue'), // 或 'Dashboard'
        alias: '/home' // 为主页添加一个别名
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/ShopPage.vue') // 更改为ShopPage或其他名称
      },
      {
        path: 'shop/:shopId', // 仍然使用动态路由参数
        name: 'shopDetails',
        component: () => import('@/views/ShopDetailsPage.vue'), // 商家详情组件
        meta: { hideHeader: true, hideFooter: true } // 添加元信息
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/CartPage.vue')
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/MessagesPage.vue') // 更改为MessagesPage或Inbox
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/ProfilePage.vue')
      }
      // 其他子路由...
    ]
  }
]

// 在应用初始化之前 避免重复路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  return originalPush.call(this, location, onResolve, onReject).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
