// mask.js
export default {
  namespaced: true,

  state () {
    return {
      visible: false, // 遮罩层是否可见
      dialog: false, // 弹窗层是否可见
      callback: null // 存储回调函数
    }
  },

  mutations: {
    toggle (state, visible) {
      state.visible = visible
    },
    setCallback (state, callback = null) {
      state.callback = callback
    }
  },

  actions: {
    showOverlay ({ commit }, callback) {
      commit('toggle', true)
      commit('setCallback', callback) // 设置回调函数
    },
    hideOverlay ({ commit, state }) {
      if (state.callback) {
        state.callback() // 执行回调函数
      }
      commit('toggle', false)
      commit('setCallback', null) // 清除回调函数
    }
  },

  getters: {
    isMaskVisible (state) {
      return state.visible
    },
    isDialogVisible (state) {
      return state.dialog
    }
  }
}
