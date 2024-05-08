import axios from 'axios'
import { Message } from 'element-ui' // 确保你的项目已经安装了Element UI

console.log('Base URL:', process.env.VUE_APP_BASE_API)

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 从环境变量读取API基地址
  timeout: 30000 // 设置超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 这里可以设置一些请求头等信息
    const authUser = localStorage.getItem('authUser')
    if (authUser) {
      const { token } = JSON.parse(authUser)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    console.error('Request error:', error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      Message({
        message: res.message || '请求错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error11'))
    } else {
      return res
    }
  },
  error => {
    console.error('Response error:', error) // for debug
    // if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    // 处理登录失效，如跳转登录页或提示
    // router.push('/login');
    // alert('Session expired. Please login again.')
    //   Message({
    //     message: error.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }
    // return Promise.reject(error)
    return Promise.reject(error.response.data)
  }
)

export default service
