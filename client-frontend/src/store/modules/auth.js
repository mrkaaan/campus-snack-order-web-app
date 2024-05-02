export default {
  namespaced: true, // 启用命名空间
  state: {
    isAuthenticated: false,
    user: {},
    token: null,
    mode: null
  },
  mutations: {
    setAuth (state, payload) {
      state.isAuthenticated = payload.isAuthenticated
      state.user = payload.user || {} // 确保没有提供 user 时，user 为 null
      state.token = payload.token
      state.mode = payload.mode
    },
    clearAuth (state) {
      state.isAuthenticated = false
      state.user = {}
      state.token = null
      state.mode = null
    }
  },
  actions: {
    initializeAuth ({ commit }) {
      return new Promise((resolve, reject) => {
        const authUser = localStorage.getItem('authUser')
        console.log('authUser:', authUser)
        if (authUser) {
          const { user, token, mode } = JSON.parse(authUser)
          console.log('authUser:', user, token, mode)
          commit('setAuth', { isAuthenticated: true, user, token, mode })
          resolve()
        } else {
          commit('clearAuth')
          reject(new Error('登录信息已过期，请重新登录'))
        }
      })
    },
    login ({ commit }, { user, token, mode }) {
      console.log('login:', user, token)
      commit('setAuth', { isAuthenticated: true, user, token, mode })
      localStorage.setItem('authUser', JSON.stringify({ user, token, mode })) // JWT
    },
    loginGuest ({ commit }, { token }) {
      console.log('loginGuest:', token)
      commit('setAuth', { isAuthenticated: true, token, mode: 'guest' })
      localStorage.setItem('authUser', JSON.stringify({ token, mode: 'guest' })) // JWT
    },
    logout ({ state, commit }) {
      return new Promise((resolve, reject) => {
        if (state.mode === 'guest') {
          reject(new Error('游客模式 无需登出'))
        } else {
          commit('clearAuth')
          localStorage.removeItem('authUser') // 清除存储的用户信息
          resolve()
        }
      })
    }
  }
}
