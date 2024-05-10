export default {
  namespaced: true, // 启用命名空间
  state: {
    user: {},
    token: null,
    mode: null, // user 或者 merchant
    isGuest: null
  },
  mutations: {
    SET_AUTH (state, payload) {
      state.user = payload.user
      state.token = payload.token
      state.mode = payload.mode
      state.isGuest = payload.isGuest
      console.log('setAuth:', state)
    },
    CLEAT_AUTH (state) {
      state.user = {}
      state.token = null
      state.mode = null
      state.isGuest = null
    }
  },
  actions: {
    // 初始化用户数据 从本地存储中获取
    initializeAuth ({ commit }) {
      return new Promise((resolve, reject) => {
        const authUser = localStorage.getItem('authUser')
        if (authUser) {
          const { user, token, mode, isGuest } = JSON.parse(authUser)
          commit('SET_AUTH', { user, token, mode, isGuest })
          resolve()
        } else {
          commit('clearAuth')
          reject(new Error('登录信息已过期，请重新登录'))
        }
      })
    },
    // 清楚用户数据
    clearAuth ({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('CLEAT_AUTH')
        localStorage.removeItem('authUser') // 清除存储的用户信息
        resolve()
      })
    },
    // 更新用户数据 从接口返回结果中
    updateAuth ({ commit }, { user, token, mode, isGuest }) {
      commit('SET_AUTH', { user, token, mode, isGuest })
      localStorage.setItem('authUser', JSON.stringify({ user, token, mode, isGuest }))
    }
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    mode: state => state.mode,
    isGuest: state => state.isGuest
  }
}
