import { getMerchantDetails, getMerchantProducts } from '@/api/merchant'

export default {
  namespaced: true,
  state: {
    merchantTags: [],
    merchantDetails: null,
    merchantProducts: null
  },
  mutations: {
    SET_CURRENT_MERCHANT_DETAILS (state, merchantDetails) {
      state.merchantDetails = merchantDetails
      console.log('存储vuex merchantDetails', state.merchantDetails)
    },
    ADD_TAG (state, tag) {
      const merchantTag = state.merchantTags.find(t => t.merchantId === tag.merchantId)
      if (!merchantTag) {
        state.merchantTags.push(tag)
      }
      console.log('merchantTags', state.merchantTags)
    },
    REMOVE_TAG (state, merchantId) {
      const index = state.merchantTags.findIndex(t => t.merchantId === merchantId)
      if (index !== -1) {
        state.merchantTags.splice(index, 1)
      }
    },
    SET_MERCHANT_PRODUCTS (state, products) {
      state.merchantProducts = products
      console.log('更新商品列表', state.merchantProducts)
    },
    SET_MERCHANT_DETAILS (state, merchantDetails) {
      state.merchantDetails = merchantDetails
    },
    UPDATE_PRODUCT_QUANTITY (state, {
      merchantId = null,
      productId = null,
      quantity
    }) {
      // 指定更新商品数据
      if (productId) {
        if (state.merchantProducts && state.merchantDetails) {
          if (state.merchantDetails.merchantId === merchantId) {
            const product = state.merchantProducts.map(category => category.items)
              .flat() // 展平所有 items 数组为一个数组
              .find(item => item.productId === productId)
            if (product) {
              if (Math.sign(quantity) === 1) {
                product.quantity += 1
              } else if (Math.sign(quantity) === -1) {
                product.quantity -= 1
              } else {
                product.quantity = 0
              }
            }
          }
        }
      } else {
        // 清空全部商品数量
        if (state.merchantProducts && state.merchantDetails) {
          if (state.merchantDetails.merchantId === merchantId) {
            state.merchantProducts.map(category => category.items)
              .flat() // 展平所有 items 数组为一个数组
              .forEach(product => {
                product.quantity = 0
              })
          }
        }
      }
    }
  },
  actions: {
    async updateMerchantDetails ({ commit }, merchantDetails) {
      commit('SET_CURRENT_MERCHANT_DETAILS', merchantDetails)
      commit('ADD_TAG', merchantDetails)
    },
    removeMerchantTag ({ commit }, merchantId) {
      commit('REMOVE_TAG', merchantId)
    },
    // 获取商家商品数据并扩展 同时标记购物车中被移除商品
    async fetchProducts ({ commit, rootGetters }, merchantId) {
      try {
        // 发送请求获取商家商品数据
        const response = await getMerchantProducts(merchantId)
        const originalData = response.data.productCategories
        // 获取购物车数据
        const cartItems = rootGetters['cart/cartByMerchant'](merchantId)
        // 在购物车中标记被商家移除的商品
        const productIds = originalData.flatMap(category => category.items.map(product => product.productId)) // 提取所有商品Id
        commit('cart/MARK_REMOVED_ITEMS', {
          merchantId: merchantId,
          activeProductIds: productIds
        }, { root: true }) // 通过root: true访问cart模块
        // 扩展商品数据，添加购物车数量和是否被选中
        const extendedData = originalData.map(category => ({
          ...category,
          items: category.items.map(product => {
            const cartItem = cartItems.find(item => item.productId === product.productId) || {}
            const originalPrice = product.originalPrice || product.salePrice // 如果只有销售价没有原价 则原价等于销售价
            const salePrice = product.salePrice === originalPrice ? 0 : product.salePrice // 如果原价等于现价，则销售价为0

            return {
              ...product,
              quantity: cartItem.quantity ? (cartItem.quantity >= 0 ? cartItem.quantity : 0) : 0, // 从购物车获取数量
              originalPrice: originalPrice,
              salePrice: salePrice
              // isSelected: !!cartItem.quantity // 判断购物车中是否有该商品
            }
          })
        }))
        // 保存扩展后的商品数据
        commit('SET_MERCHANT_PRODUCTS', extendedData)
      } catch (error) {
        throw new Error('Failed to fetch products: ' + error.message)
      }
    },
    async fetchMerchantDetails ({ commit }, merchantId) {
      try {
        const response = await getMerchantDetails(merchantId)
        const merchantDetails = response.data
        commit('SET_CURRENT_MERCHANT_DETAILS', merchantDetails)
        commit('ADD_TAG', merchantDetails)
      } catch (error) {
        throw new Error('Failed to fetch merchant details: ' + error.message)
      }
    }
  },
  getters: {
    merchantTags: state => state.merchantTags,
    merchantProducts: state => state.merchantProducts,
    merchantDetails: state => state.merchantDetails,
    // 返回merchantTags长度
    merchantTagsCount: state => state.merchantTags.length
  }
}
