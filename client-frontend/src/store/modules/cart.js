// store/modules/cart.js
export default {
  namespaced: true,
  state: {
    isExpanded: false,
    cartItems: []
  },
  mutations: {
    ADD_TO_CART (state, { item, merchant }) {
      const merchantId = merchant.merchantId
      const merchantName = merchant.storeName
      let merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (!merchantCart) {
        // 如果当前商家没有购物车，则创建一个新的购物车条目
        merchantCart = {
          merchantId,
          merchantName,
          items: [],
          totalPrice: 0,
          discountedPrice: 0
        }
        state.cartItems.push(merchantCart)
      }
      const existingItem = merchantCart.items.find(i => i.productId === item.productId)
      // console.log('existingItem', existingItem)
      // console.log('item', item)

      if (existingItem) {
        existingItem.quantity += 1 // 如果商品已存在，增加数量
        merchantCart.totalPrice += existingItem.originalPrice
        merchantCart.discountedPrice += existingItem.salePrice
      } else {
        // 添加新商品到该商家的购物车
        merchantCart.items.push({
          productId: item.productId,
          name: item.name,
          image: item.image,
          description: item.description,
          quantity: 1,
          originalPrice: item.originalPrice,
          salePrice: item.salePrice,
          selected: false,
          isShow: false,
          totalPrice: item.originalPrice * item.quantity, // 初始化商品总价
          discountedPrice: item.salePrice * item.quantity // 初始化商品折扣价
        })
        merchantCart.totalPrice += item.originalPrice
        merchantCart.discountedPrice += item.salePrice
      }
      // console.log('cart state.cartItems', state.cartItems)
    },
    REMOVE_FROM_CART (state, { item, merchant }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchant.merchantId)
      if (merchantCart) {
        const index = merchantCart.items.findIndex(i => i.productId === item.productId)
        if (index !== -1) {
          const product = merchantCart.items[index]
          if (product.quantity > 1) {
            product.quantity -= 1
            merchantCart.totalPrice -= product.originalPrice
            merchantCart.discountedPrice -= product.salePrice
            product.totalPrice -= product.salePrice
            product.discountedPrice -= product.originalPrice
          } else {
            merchantCart.totalPrice -= product.originalPrice * product.quantity
            merchantCart.discountedPrice -= product.salePrice * product.quantity
            merchantCart.items.splice(index, 1) // 删除该商品
          }
        }
      }
    },
    TOGGLE_ITEM_SELECTION (state, { itemId, merchantId }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        const item = merchantCart.items.find(i => i.itemId === itemId)
        if (item) {
          item.selected = !item.selected
        }
      }
    },
    TOGGLE_SHOW (state, { itemId, merchantId }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        const item = merchantCart.items.find(i => i.itemId === itemId)
        if (item) {
          item.isShow = !item.isShow
        }
      }
    },
    CLEAR_CART (state, merchantId) {
      const index = state.cartItems.findIndex(m => m.merchantId === merchantId)
      if (index !== -1) {
        state.cartItems.splice(index, 1) // 清空指定商家的购物车
      }
    },
    setIsExpanded (state, isExpanded) {
      state.isExpanded = isExpanded
    }
  },
  actions: {
    addToCart ({ commit }, payload) {
      commit('ADD_TO_CART', payload)
      commit('merchant/UPDATE_PRODUCT_QUANTITY', { productId: payload.item.productId, quantity: 1 }, { root: true }) // 同步更新商家模块的商品数量
    },
    removeFromCart ({ commit }, payload) {
      commit('REMOVE_FROM_CART', payload)
      commit('merchant/UPDATE_PRODUCT_QUANTITY', { productId: payload.item.productId, quantity: -1 }, { root: true }) // 同步更新商家模块的商品数量
    },
    toggleItemSelection ({ commit }, payload) {
      commit('TOGGLE_ITEM_SELECTION', payload)
    },
    toggleShow ({ commit }, payload) {
      commit('TOGGLE_SHOW', payload)
    },
    clearCart ({ commit }, merchantId) {
      commit('CLEAR_CART', merchantId)
    },
    updateIsExpanded ({ commit }, isExpanded) {
      commit('setIsExpanded', isExpanded)
    }
  },
  getters: {
    cartByMerchant: (state) => (merchantId) => {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      return merchantCart ? merchantCart.items : []
    },
    getAllCartItems: (state) => {
      return state.cartItems
    },
    isExpanded: state => state.isExpanded
  }
}
