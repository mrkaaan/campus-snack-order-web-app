// store/modules/cart.js
export default {
  namespaced: true,
  state: {
    items: {}
  },
  mutations: {
    addItem (state, { productId, productData }) {
      if (state.items[productId]) {
        state.items[productId].quantity += 1
      } else {
        state.items[productId] = { ...productData, quantity: 1 }
      }
    },
    removeItem (state, productId) {
      if (state.items[productId].quantity > 1) {
        state.items[productId].quantity -= 1
      } else {
        delete state.items[productId]
      }
    },
    clearCart (state) {
      state.items = {}
    }
  },
  actions: {
    initializeCart ({ commit }) {
      const cart = JSON.parse(localStorage.getItem('cart')) || {}
      Object.entries(cart).forEach(([productId, productData]) => {
        commit('addItem', { productId, productData })
      })
    },
    updateLocalStorage ({ state }) {
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  },
  getters: {
    cartItems: state => state.items,
    cartTotal: state => Object.values(state.items).reduce((total, item) => total + item.price * item.quantity, 0)
  }
}
