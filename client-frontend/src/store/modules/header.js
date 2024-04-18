export default {
  namespaced: true, // 启用命名空间
  state: {
    lastScroll: 0,
    currentScroll: 0,
    headerHeight: 0,
    headerTop: 0
  },
  mutations: {
    updateScroll (state, { currentScroll }) {
      state.lastScroll = state.currentScroll
      state.currentScroll = currentScroll
    },
    setHeaderHeight (state, height) {
      state.headerHeight = height
    },
    setHeaderTop (state, top) {
      state.headerTop = top
    }
  },
  actions: {
    handleScroll ({ commit }, { currentScroll }) {
      commit('updateScroll', { currentScroll })
    },
    updateHeaderHeight ({ commit }, height) {
      commit('setHeaderHeight', height)
    },
    updateHeaderTop ({ commit }, top) {
      commit('setHeaderTop', top)
    }
  },
  getters: {
    headerHeight: state => state.headerHeight,
    headerTop: state => state.headerTop
  }
}
