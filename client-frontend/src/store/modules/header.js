export default {
  namespaced: true, // 启用命名空间
  state: {
    lastScroll: 0,
    currentScroll: 0,
    headerHeight: 0
  },
  mutations: {
    updateScroll (state, { currentScroll, headerHeight }) {
      state.lastScroll = state.currentScroll
      state.currentScroll = currentScroll
      state.headerHeight = headerHeight
    }
  },
  actions: {
    handleScroll ({ commit }, { currentScroll, headerHeight }) {
      commit('updateScroll', { currentScroll, headerHeight })
    }
  }
}
