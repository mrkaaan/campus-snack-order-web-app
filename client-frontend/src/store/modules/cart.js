// store/modules/cart.js
export default {
  namespaced: true,
  state: {
    isExpanded: false,
    cartItems: [],
    totalSalePrice: 0,
    totalOriginalPrice: 0
  },
  mutations: {
    ADD_TO_CART (state, { item, merchant }) {
      // 将商品添加到购物车
      const merchantId = merchant.merchantId
      const merchantName = merchant.storeName
      // 查找当前商家的购物车
      let merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (!merchantCart) {
        // 如果当前商家没有购物车，则创建一个新的购物车条目
        merchantCart = {
          merchantId,
          merchantName,
          items: [],
          totalSalePrice: 0,
          totalOriginalPrice: 0
        }
        state.cartItems.push(merchantCart)
      }

      // 查找当前商品是否已经在商家购物车中
      const existingItem = merchantCart.items.find(i => i.productId === item.productId)
      if (existingItem) {
        existingItem.quantity += 1 // 如果商品已存在，增加数量
        // 更新商品的总价和折扣总价
        existingItem.totalSalePrice = parseFloat(((existingItem.salePrice || existingItem.originalPrice) * item.quantity).toFixed(2)) // 更新商品的总价
        // 更新商品的折扣总价
        if (!existingItem.salePrice) {
          existingItem.totalOriginalPrice = parseFloat((existingItem.totalOriginalPrice).toFixed(2))
        } else {
          existingItem.totalOriginalPrice = parseFloat((item.originalPrice * item.quantity).toFixed(2))
        }

        // 更新商家购物车的总价和折扣总价
        merchantCart.totalSalePrice = parseFloat((merchantCart.totalSalePrice + existingItem.salePrice).toFixed(2))
        merchantCart.totalOriginalPrice = parseFloat((merchantCart.totalOriginalPrice + existingItem.originalPrice).toFixed(2))
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
          isShowStepper: false,
          totalSalePrice: item.salePrice || item.originalPrice, // 初始化商品总价
          totalOriginalPrice: item.salePrice ? item.originalPrice : 0 // 初始化商品折扣价
        })
        // 更新商家购物车的总价和折扣总价
        merchantCart.totalSalePrice = parseFloat((merchantCart.totalSalePrice + (item.salePrice || item.originalPrice)).toFixed(2))
        if (!item.originalPrice) {
          merchantCart.totalOriginalPrice = parseFloat((merchantCart.totalOriginalPrice).toFixed(2))
        } else {
          merchantCart.totalOriginalPrice = parseFloat((merchantCart.totalOriginalPrice * item.quantity).toFixed(2))
        }
        // 更新全部商家的全部商品总价
        state.totalSalePrice = parseFloat((state.totalSalePrice + (item.salePrice || item.originalPrice)).toFixed(2))
        if (!item.originalPrice) {
          state.totalOriginalPrice = parseFloat((state.totalOriginalPrice).toFixed(2))
        } else {
          state.totalOriginalPrice = parseFloat((state.totalOriginalPrice + item.originalPrice).toFixed(2))
        }
      }
      console.log('cart state.cartItems', state.cartItems)
    },
    REMOVE_FROM_CART (state, { item, merchant }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchant.merchantId)
      if (merchantCart) {
        const index = merchantCart.items.findIndex(i => i.productId === item.productId)
        if (index !== -1) {
          const product = merchantCart.items[index]
          product.quantity -= 1
          // 更新商品的总价和折扣总价
          product.totalSalePrice = parseFloat((product.totalSalePrice - item.salePrice).toFixed(2))
          product.totalOriginalPrice = parseFloat((product.totalOriginalPrice - item.originalPrice).toFixed(2))
          if (product.quantity === 0) {
            merchantCart.items.splice(index, 1)
          }
          // 更新商家购物车的总价和折扣总价
          merchantCart.totalSalePrice = parseFloat((merchantCart.totalSalePrice - item.salePrice).toFixed(2))
          merchantCart.totalOriginalPrice = parseFloat((merchantCart.totalOriginalPrice - item.originalPrice).toFixed(2))
          // 更新全部商家的全部商品总价
          state.totalSalePrice = parseFloat((state.totalSalePrice - item.salePrice).toFixed(2))
          state.totalOriginalPrice = parseFloat((state.totalOriginalPrice - item.originalPrice).toFixed(2))
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
    TOGGLE_STEPPER_SHOW (state, { productId, merchantId }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        const item = merchantCart.items.find(i => i.productId === productId)
        if (item) {
          item.isShowStepper = !item.isShowStepper
        }
      }
    },
    CLEAR_CART (state, merchantId) {
      const index = state.cartItems.findIndex(m => m.merchantId === merchantId)
      if (index !== -1) {
        const merchantCart = state.cartItems[index]
        state.totalSalePrice -= merchantCart.totalSalePrice
        state.totalOriginalPrice -= merchantCart.totalOriginalPrice
        state.cartItems.splice(index, 1) // 清空指定商家的购物车
      }
    },
    setIsExpanded (state, isExpanded) {
      state.isExpanded = isExpanded
    },
    // 检查并购物车中是否存在已被商家移除的商品 若有则标记
    MARK_REMOVED_ITEMS (state, { merchantId, activeProductIds }) {
      // 获取购物车中指定商家的商品列表
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        merchantCart.items.forEach(item => {
          if (!activeProductIds.includes(item.productId)) {
            item.removed = true // 标记商品为"已移除"
          }
        })
      }
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
    toggleStepperShow ({ commit }, payload) {
      commit('TOGGLE_STEPPER_SHOW', payload)
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
    isExpanded: state => state.isExpanded,
    getTotalSalePrice: state => state.totalSalePrice,
    getTotalOriginalPrice: state => state.totalOriginalPrice,

    getTotalSalePriceByMerchant: (state) => (merchantId) => {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      return merchantCart ? merchantCart.totalSalePrice : 0
    },
    getTotalOriginalPriceByMerchant: (state) => (merchantId) => {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      return merchantCart ? merchantCart.totalOriginalPrice : 0
    }
  }
}
