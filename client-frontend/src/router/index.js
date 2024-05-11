import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    component: () => import('@/views/MainLayout.vue'), // 布局组件
    children: [
      {
        path: '',
        redirect: '/user/home'
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/HomePage.vue'), // 或 'Dashboard'
        meta: { requiresAuth: true, role: 'user' } // 确保需要认证
      },
      {
        path: 'merchant',
        component: () => import('@/views/MerchantPage.vue'), // 新商家页面
        children: [
          {
            path: ':merchantId',
            name: 'merchantDetails',
            component: () => import('@/views/MerchantDetailsPage.vue'), // 商家详情组件
            meta: { hideHeader: true, hideFooter: true, requiresAuth: true }
          }
        ],
        meta: { requiresAuth: true, role: 'user' }
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/CartPage.vue'),
        meta: { requiresAuth: true, role: 'user' } // 确保需要认证
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/MessagesPage.vue'),
        meta: { requiresAuth: true, role: 'user' } // 确保需要认证
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/ProfilePage.vue'),
        meta: { requiresAuth: true, role: 'user' }
      }
    ]
  },
  {
    path: '/merchant',
    component: () => import('@/views/MainLayout.vue'), // 布局组件
    children: [
      {
        path: '',
        redirect: '/merchant/order' // 当访问 /merchant 时自动重定向到 /merchant/order
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/merchant/OrderManagement.vue'),
        meta: { requiresAuth: true, role: 'merchant' }
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/merchant/Search.vue'),
        meta: { requiresAuth: true, role: 'merchant' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/ProfilePage.vue'),
        meta: { requiresAuth: true, role: 'merchant' }
      }
    ]
  },
  // 共用登录注册页面
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth) // 判断页面是否鉴权
  const roleRequired = to.meta.role // 判断页面是否需要特定角色
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
  const userRole = authUser.mode
  const token = authUser.token
  console.log('from:', from, 'to:', to)
  // 处理访问根路径的情况
  if (to.path === '/') {
    if (!token) {
      next({ path: '/initial' })
    } else {
      if (userRole === 'user') {
        if (from.path !== '/user/home') {
          next({ path: '/user/home' })
        } else {
          next()
        }
      } else if (userRole === 'merchant') {
        if (from.path !== '/merchant/order') {
          next({ path: '/merchant/order' })
        } else {
          next()
        }
      } else {
        next({ path: '/initial' })
      }
      return // 提前返回
    }
  }
  if (requiresAuth && !token) {
    // 如果需要认证并且没有token，则跳转到登录界面
    next({ path: '/initial', query: { redirect: to.fullPath } })
    Vue.prototype.$message.info('请登录或使用游客登录')
  } else if (requiresAuth && roleRequired && roleRequired !== userRole) {
    if (from.path !== '/initial') { // 避免重复重定向到初始页面
      next({ path: '/initial' })
    } else {
      next(false) // 停止路由导航
    }
    // 如果用户角色不匹配，则阻止访问并可能跳转到错误页面或首页
    Vue.prototype.$message.info('无权限访问此页面')
  } else {
    next()
  }
})

export default router
