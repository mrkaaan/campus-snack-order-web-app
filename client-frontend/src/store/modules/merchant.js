export default {
  namespaced: true,
  state: {
    currentMerchant: null
  },
  mutations: {
    updateCurrentMerchant (state, merchant) {
      state.currentMerchant = merchant
    }
  },
  actions: {
    updateCurrentMerchant ({ commit }, merchant) {
      commit('updateCurrentMerchant', merchant)
    }
  }
}
