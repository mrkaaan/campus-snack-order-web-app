import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { loginGuest as loginGuestApi } from '@/api/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/MainLayout.vue'), // 更改为新的布局组件名
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomePage.vue'), // 或 'Dashboard'
        alias: '/home', // 为主页添加一个别名
        meta: { requiresAuth: true } // 确保需要认证
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/ShopPage.vue'),
        meta: { requiresAuth: true } // 确保需要认证
      },
      {
        path: 'shop/:shopId', // 仍然使用动态路由参数
        name: 'shopDetails',
        component: () => import('@/views/ShopDetailsPage.vue'), // 商家详情组件
        meta: { hideHeader: true, hideFooter: true, requiresAuth: true }
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/CartPage.vue'),
        meta: { requiresAuth: true } // 确保需要认证
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/MessagesPage.vue'),
        meta: { requiresAuth: true } // 确保需要认证
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/ProfilePage.vue'),
        meta: { requiresAuth: true }
      }
      // 其他子路由...
    ]
  },
  {
    path: '/initial',
    name: 'initial',
    component: () => import('@/views/InitialPage.vue'), // 登录注册页面
    meta: { requiresAuth: false } // 不需要验证
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
router.beforeEach((to, from, next) => {
  (async () => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const authUserStr = localStorage.getItem('authUser')
    console.log('routing authUser', authUserStr)
    if (!requiresAuth) {
      next()
      return
    }
    if (!authUserStr) {
      // 如果无有效的认证信息，重新以游客身份登录并获取游客token
      await handleGuestLogin(next)
      return
    }

    const authUser = JSON.parse(authUserStr)
    const mode = authUser.mode || null
    const token = authUser.token || null

    if (!token) {
      // 如果token不存在，也需要重新以游客身份登录并获取游客token
      await handleGuestLogin(next)
      return
    }

    if (mode === null) {
      // 如果模式不是正常用户，重新以游客身份登录并获取游客token
      await handleGuestLogin(next)
      return
    }
    next() // 如果是正常模式且有token，继续正常流程

  // const isAuthenticated = store.state.auth.isAuthenticated || localStorage.getItem('authUser')// 检查是否存储了认证用户信息
  // console.log('isAuthenticated:', isAuthenticated)
  // console.log('to.path:', to.path, 'from.path:', from.path)
  // // next()
  // // 检查是否需要认证且用户是否认证
  // if (requiresAuth && !isAuthenticated) {
  //   if (to.path !== '/initial') {
  //     console.log('由于缺少身份验证，正在重定向到登录页面.')
  //     next({ path: '/initial', query: { redirect: to.fullPath } }) // 重定向到登录页并记录原本想要访问的页面
  //   } else {
  //     // 如果已经在登录页面，避免重复重定向
  //     console.log('已经在登录页面.')
  //     next()
  //   }
  // } else {
  //   // 如果不需要认证或用户已认证，继续进行导航
  //   console.log('正在进行路线选择.')
  //   next()
  // }
  })()
})

async function handleGuestLogin (next) {
  try {
    const response = await loginGuestApi() // 返回新的游客token
    store.dispatch('auth/loginGuest', { token: response.data.token })
    next() // 继续当前路由
    Vue.prototype.$message.info('已使用游客登录')
  } catch (error) {
    console.error('Guest login error', error)
    Vue.prototype.$message.error('游客登录失败, 请稍后再试')
    next('/initial') // 游客登录失败，跳转到登录页
  }
}

export default router
