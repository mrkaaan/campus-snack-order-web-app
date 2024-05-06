import { getMerchantProducts } from '@/api/merchant'

export default {
  namespaced: true,
  state: {
    currentMerchant: null,
    merchantTags: [],
    merchantProducts: null
  },
  mutations: {
    updateCurrentMerchant (state, merchant) {
      state.currentMerchant = merchant
    },
    addTag (state, tag) {
      const merchantTag = state.merchantTags.find(t => t.merchantId === tag.merchantId)
      if (!merchantTag) {
        state.merchantTags.push({
          merchantId: tag.merchantId,
          name: tag.storeName
        })
      }
      console.log('merchantTags', state.merchantTags)
    },
    removeTag (state, tag) {
      const index = state.merchantTags.indexOf(tag)
      if (index > -1) {
        state.merchantTags.splice(index, 1)
      }
    },
    SET_MERCHANT_PRODUCTS (state, products) {
      state.merchantProducts = products
    },
    UPDATE_PRODUCT_QUANTITY (state, { productId, quantity }) {
      const product = state.merchantProducts.map(category => category.items)
        .flat() // 展平所有 items 数组为一个数组
        .find(item => item.productId === productId)
      if (product) {
        if (Math.sign(quantity)) {
          product.quantity += quantity
        } else {
          product.quantity -= quantity
        }
      }
    }
  },
  actions: {
    updateCurrentMerchant ({ commit }, merchant) {
      commit('updateCurrentMerchant', merchant)
      commit('addTag', merchant)
    },
    removeMerchantTag ({ commit }, tag) {
      commit('removeTag', tag)
    },
    async fetchProducts ({ commit, rootGetters }, merchantId) {
      try {
        const response = await getMerchantProducts(merchantId)
        const originalData = response.data.productCategories
        const cartItems = rootGetters['cart/cartByMerchant'](merchantId)
        const extendedData = originalData.map(category => ({
          ...category,
          items: category.items.map(product => {
            const cartItem = cartItems.find(item => item.productId === product.productId) || {}
            const originalPrice = product.originalPrice || product.salePrice // 如果只有销售价没有原价 则原价等于销售价
            const salePrice = product.salePrice === originalPrice ? 0 : product.salePrice // 如果原价等于现价，则销售价为0

            return {
              ...product,
              quantity: cartItem.quantity || 0, // 从购物车获取数量
              salePrice: salePrice, // 假设存在此属性
              isSelected: !!cartItem.quantity // 判断购物车中是否有该商品
            }
          })
        }))

        commit('SET_MERCHANT_PRODUCTS', extendedData) // 假设存在此 mutation
      } catch (error) {
        throw new Error('Failed to fetch products: ' + error.message)
      }
    }
  }
}
