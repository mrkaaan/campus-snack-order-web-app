// store/modules/cart.js
export default {
  namespaced: true,
  state: {
    isExpanded: false,
    cartItems: [],
    totalSalePrice: 0,
    totalOriginalPrice: 0,
    totalDiscount: 0,
    selectedSalePrice: 0,
    selectedOriginalPrice: 0,
    selectedDiscount: 0,
    orders: []
  },
  mutations: {
    // 新增商品到购物车
    ADD_TO_CART (state, { item, merchant }) {
      // 将商品添加到购物车
      const merchantId = merchant.merchantId
      let merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (!merchantCart) {
        // 如果当前商家没有购物车，则创建一个新的购物车条目
        merchantCart = {
          merchantId: merchantId,
          storeName: merchant.storeName,
          items: [],
          selected: false,
          totalSalePrice: 0,
          totalOriginalPrice: 0,
          totalDiscount: 0,
          selectedSalePrice: 0,
          selectedOriginalPrice: 0,
          selectedDiscount: 0
        }
        state.cartItems.push(merchantCart)
      }

      // 查找当前商品是否已经在商家购物车中
      const existingItem = merchantCart.items.find(i => i.productId === item.productId)
      if (existingItem) {
        existingItem.quantity += 1 // 如果商品已存在，增加数量
      } else {
        // 添加新商品到该商家的购物车
        merchantCart.items.push({
          productId: item.productId,
          name: item.name,
          image: item.image,
          description: item.description,
          quantity: 1,
          salePrice: item.salePrice,
          originalPrice: item.originalPrice,
          discount: item.salePrice ? parseFloat((item.salePrice - item.quantity).toFixed(2)) : 0,
          selected: false,
          isShowStepper: false
        })
      }
      this.commit('cart/UPDATE_TOTAL_PRICE')
      console.log('cart state.cartItems', state.cartItems)
    },
    // 更新购物中商品总价
    UPDATE_TOTAL_PRICE (state) {
      // 初始化整个购物车的总价
      state.totalSalePrice = 0
      state.totalOriginalPrice = 0
      state.totalDiscount = 0

      // 遍历每个商家的购物车
      state.cartItems.forEach(merchantCart => {
        // 初始化当前商家购物车的总价
        merchantCart.totalSalePrice = 0
        merchantCart.totalOriginalPrice = 0
        merchantCart.totalDiscount = 0

        // 遍历当前商家购物车中的每个商品
        merchantCart.items.forEach(item => {
          // 计算单个商品的总价
          // 确保 salePrice 有效，否则默认为 0
          const itemSalePrice = item.salePrice || 0
          const itemOriginalPrice = item.originalPrice
          const itemDiscount = itemSalePrice ? parseFloat((item.originalPrice - item.salePrice).toFixed(2)) : 0

          // 计算单个商品的总折扣价和原价
          item.totalSalePrice = parseFloat((itemSalePrice * item.quantity).toFixed(2))
          item.totalOriginalPrice = parseFloat((itemOriginalPrice * item.quantity).toFixed(2))
          item.totalDiscount = itemDiscount * item.quantity
          // 累计当前商家购物车的总折扣价和原价
          merchantCart.totalSalePrice = parseFloat((merchantCart.totalSalePrice + (item.salePrice ? item.totalSalePrice : item.totalOriginalPrice)).toFixed(2))
          merchantCart.totalOriginalPrice = parseFloat((merchantCart.totalOriginalPrice + (item.salePrice ? item.totalOriginalPrice : 0)).toFixed(2))
          merchantCart.totalDiscount = parseFloat((merchantCart.totalDiscount + item.totalDiscount).toFixed(2))
        })

        // 累计整个购物车的总折扣价和原价
        state.totalSalePrice = parseFloat((state.totalSalePrice + merchantCart.totalSalePrice).toFixed(2))
        state.totalOriginalPrice = parseFloat((state.totalOriginalPrice + merchantCart.totalOriginalPrice).toFixed(2))
        state.totalDiscount = parseFloat((state.totalDiscount + merchantCart.totalDiscount).toFixed(2))
      })
    },
    // 更新购物车中选中商品价格
    UPDATE_SELECTED_PRICE (state) {
      state.selectedSalePrice = 0
      state.selectedOriginalPrice = 0
      state.selectedDiscount = 0

      state.cartItems.forEach(merchantCart => {
        merchantCart.selectedSalePrice = 0
        merchantCart.selectedOriginalPrice = 0
        merchantCart.selectedDiscount = 0

        merchantCart.items.forEach(item => {
          if (item.selected) {
            merchantCart.selectedSalePrice = parseFloat((merchantCart.selectedSalePrice + (item.totalSalePrice ? item.totalSalePrice : item.totalOriginalPrice)).toFixed(2))
            merchantCart.selectedOriginalPrice = parseFloat((merchantCart.selectedOriginalPrice + item.totalOriginalPrice).toFixed(2))
            merchantCart.selectedDiscount = parseFloat((merchantCart.selectedOriginalPrice - merchantCart.selectedSalePrice).toFixed(2))
          }
        })

        state.selectedSalePrice = parseFloat((state.selectedSalePrice + merchantCart.selectedSalePrice).toFixed(2))
        state.selectedOriginalPrice = parseFloat((state.selectedOriginalPrice + merchantCart.selectedOriginalPrice).toFixed(2))
        state.selectedDiscount = parseFloat((state.selectedOriginalPrice - state.selectedSalePrice).toFixed(2))
      })
    },
    // 更新被选中的商品的在商家中的总价格
    UPDATE_MERCHANT_SELECTED_PRICE (state, { merchantId, selectedPriceId }) {
      // 找到对应商家的购物车条目
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (!merchantCart) {
        console.error('购物车中不存在该商家')
        return
      }

      // 初始化被选中商品的总价格
      merchantCart.selectedSalePrice = 0
      merchantCart.selectedOriginalPrice = 0

      // 遍历当前商家购物车中的每个商品
      merchantCart.items.forEach(item => {
        // 检查商品是否被选中
        if (item.productId === selectedPriceId) {
          // 累计当前商家购物车中被选中商品的总折扣价和原价
          merchantCart.selectedSalePrice += item.totalSalePrice
          merchantCart.selectedOriginalPrice += item.totalOriginalPrice
        }
      })
    },

    // 单个移除购物车中商品
    REMOVE_FROM_CART (state, { item, merchant }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchant.merchantId)
      if (merchantCart) {
        const index = merchantCart.items.findIndex(i => i.productId === item.productId)
        if (index !== -1) {
          const product = merchantCart.items[index]
          product.quantity -= 1
          if (product.quantity === 0) {
            merchantCart.items.splice(index, 1)
          }
        }
      }
      this.commit('cart/UPDATE_TOTAL_PRICE')
    },

    // 切换购物车中指定商品的选中状态
    TOGGLE_ITEM_SELECTION (state, { itemId, merchantId }) {
      console.log(itemId, merchantId)
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        const item = merchantCart.items.find(i => i.productId === itemId)
        if (item) {
          item.selected = !item.selected
          // 检查当前商家商品是否全部选中
          merchantCart.selected = merchantCart.items.every(i => i.selected)
        }
      }
      this.commit('cart/UPDATE_SELECTED_PRICE')
    },
    // 切换购物车中指定商家的全选状态
    TOGGLE_MERCHANT_SELECTION (state, { merchantId }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        merchantCart.items.forEach(item => {
          item.selected = !merchantCart.selected
        })
        merchantCart.selected = !merchantCart.selected
      }
      this.commit('cart/UPDATE_SELECTED_PRICE')
    },
    // 切换购物车全部商品的全选状态
    TOGGLE_ALL_SELECTION (state) {
      state.cartItems.forEach(merchantCart => {
        merchantCart.items.forEach(item => {
          item.selected = !merchantCart.selected
        })
        merchantCart.selected = !merchantCart.selected
      })
      this.commit('cart/UPDATE_SELECTED_PRICE')
    },

    // 切换购物车中指定商品的数量步进器显示状态
    TOGGLE_STEPPER_SHOW (state, { productId, merchantId }) {
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        const item = merchantCart.items.find(i => i.productId === productId)
        if (item) {
          item.isShowStepper = !item.isShowStepper
        }
      }
    },

    // 清空购物车中指定商品
    CLEAR_ITEM_CART (state, { productId, merchantId }) {
      const merchant = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchant) {
        const index = merchant.items.findIndex(i => i.productId === productId)
        if (index !== -1) {
          merchant.items.splice(index, 1) // 清空指定商品
        }
        this.commit('cart/UPDATE_TOTAL_PRICE')
        this.commit('cart/UPDATE_SELECTED_PRICE')
      }
    },
    // 清空购物车中指定商家的商品
    CLEAR_MERCHANT_CART (state, merchantId) {
      const index = state.cartItems.findIndex(m => m.merchantId === merchantId)
      if (index !== -1) {
        state.cartItems.splice(index, 1) // 清空指定商家的购物车
        this.commit('cart/UPDATE_TOTAL_PRICE')
        this.commit('cart/UPDATE_SELECTED_PRICE')
      }
    },
    // 清空整个购物车
    CLEAR_ALL_CART (state) {
      state.cartItems = []
      state.totalSalePrice = 0
      state.totalOriginalPrice = 0
      state.totalDiscount = 0
    },

    // 切换明细展示状态
    TOGGLE_EXPANDED (state, isExpanded) {
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
    },

    // 存储Cart
    SAVE_CART (state, uid) {
      if (!uid) return // 如果没有UID，则不保存数据
      const key = `cartItems-${uid}`
      const cartData = {
        cartItems: state.cartItems,
        totalSalePrice: state.totalSalePrice,
        totalOriginalPrice: state.totalOriginalPrice
      }
      localStorage.setItem(key, JSON.stringify(cartData)) // 根据UID区分存储

      // 将对象转换为 JSON 字符串并保存到 localStorage
      // 清空每个商品的isShowStepper字段
      // localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      // localStorage.setItem('totalSalePrice', state.totalSalePrice.toString())
      // localStorage.setItem('totalOriginalPrice', state.totalOriginalPrice.toString())
    },
    // 从 localStorage 读取 cart 状态
    READ_CART (state, uid) {
      if (!uid) return // 如果没有UID，则不加载数据
      const key = `cartItems-${uid}`
      console.log('读取指定localstorage', key)
      const cartData = JSON.parse(localStorage.getItem(key)) || {}
      state.cartItems = cartData.cartItems || []
      state.totalSalePrice = parseFloat(cartData.totalSalePrice) || 0
      state.totalOriginalPrice = parseFloat(cartData.totalOriginalPrice) || 0
      state.cartItems.forEach(merchantCart => {
        merchantCart.items.forEach(item => {
          item.isShowStepper = false // 重置显示数量调节器状态
        })
      })

      // 从 localStorage 获取数据并解析
      // state.cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
      // state.totalSalePrice = parseFloat(localStorage.getItem('totalSalePrice')) || 0
      // state.totalOriginalPrice = parseFloat(localStorage.getItem('totalOriginalPrice')) || 0
      // state.cartItems.forEach(merchantCart => {
      //   merchantCart.items.forEach(item => {
      //     item.isShowStepper = false
      //   })
      // })
    }

  },
  actions: {
    // 添加商品到购物车
    addToCart ({ commit, rootGetters }, payload) {
      commit('ADD_TO_CART', payload)
      commit('merchant/UPDATE_PRODUCT_QUANTITY', { merchantId: payload.merchant.merchantId, productId: payload.item.productId, quantity: 1 }, { root: true }) // 同步更新商家模块的商品数量
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车
    },
    // 移除购物车商品
    removeFromCart ({ commit, rootGetters }, payload) {
      commit('REMOVE_FROM_CART', payload)
      commit('merchant/UPDATE_PRODUCT_QUANTITY', { merchantId: payload.merchant.merchantId, productId: payload.item.productId, quantity: -1 }, { root: true }) // 同步更新商家模块的商品数量
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车 // 保存购物车
    },

    // 切换步进器显示状态
    toggleStepperShow ({ commit }, payload) {
      commit('TOGGLE_STEPPER_SHOW', payload)
    },

    // 清空购物车中指定的商品
    clearItemCart ({ commit, rootGetters }, payload) {
      commit('CLEAR_ITEM_CART', payload)
      commit('merchant/UPDATE_PRODUCT_QUANTITY', { merchantId: payload.merchantId, productId: payload.productId, quantity: 0 }, { root: true })
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车
    },
    // 清空购物车中指定商家的商品
    clearMerchantCart ({ commit, rootGetters }, merchantId) {
      commit('CLEAR_MERCHANT_CART', merchantId)
      commit('merchant/UPDATE_PRODUCT_QUANTITY', { quantity: 0 }, { root: true })
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车
    },
    // 清空整个购物车
    clearAllCart ({ commit, rootGetters }) {
      commit('CLEAR_ALL_CART')
      commit('merchant/UPDATE_PRODUCT_QUANTITY', { quantity: 0 }, { root: true })
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车
    },

    // 切换购物车明细展示状态
    updateIsExpanded ({ commit }, isExpanded) {
      commit('TOGGLE_EXPANDED', isExpanded)
    },

    // 更新购物车中指定商品的选中状态
    updateMerchantSelectedPrice ({ commit, rootGetters }, { merchantId, selectedPriceId }) {
      commit('UPDATE_MERCHANT_SELECTED_PRICE', { merchantId, selectedPriceId })
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车 // 保存购物车
    },

    // 从localStorage中读取购物车
    readCart ({ commit, rootGetters }) {
      const user = rootGetters['auth/user']
      const uid = user.accountId
      console.log('readCart', uid)
      commit('READ_CART', uid)
    },

    // 切换购物车全部商品的选中状态
    toggleItemSelection ({ commit, rootGetters }, payload) {
      commit('TOGGLE_ITEM_SELECTION', payload)
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车 // 保存购物车
    },
    // 切换购物车中指定商家的全选状态
    toggleMerchantSelection ({ commit, rootGetters }, merchantId) {
      commit('TOGGLE_MERCHANT_SELECTION', merchantId)
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车 // 保存购物车
    },
    // 切换购物车中指定商品的选中状态
    toggleAllSelection ({ commit, rootGetters }) {
      commit('TOGGLE_ALL_SELECTION')
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车 // 保存购物车
    },

    // 更新购物车中指定商品的数量 商品一定存在 新的数量不确定是多还是少
    updateCartProductQuantity ({ commit, state, rootGetters }, { quantity, merchantId, productId }) {
      console.log('updateCartProductQuantity', quantity, merchantId, productId)
      const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
      if (merchantCart) {
        const existingItem = merchantCart.items.find(i => i.productId === productId)
        if (existingItem) {
          const change = quantity - existingItem.quantity
          existingItem.quantity = quantity // 直接设置数量，而不是增减
          // 根据增减调用不同的 mutations
          commit('merchant/UPDATE_PRODUCT_QUANTITY', { merchantId: merchantId, productId: productId, quantity: change }, { root: true })
        }
      }
      commit('UPDATE_TOTAL_PRICE')
      commit('UPDATE_SELECTED_PRICE')
      const user = rootGetters['auth/user']
      const uid = user.accountId
      commit('SAVE_CART', uid) // 保存购物车 // 保存购物车
    },

    // 生成订单
    createOrder ({ commit, state }, { mode, merchantId = null, userId }) {
      commit('UPDATE_TOTAL_PRICE')
      const orders = []
      // 生成单个商家的订单
      if (merchantId) {
        const merchantCart = state.cartItems.find(m => m.merchantId === merchantId)
        if (merchantCart) {
          let products = null
          const order = {}
          if (mode === 'total') {
            products = merchantCart.items.filter(item => item)
            order.salePrice = merchantCart.totalSalePrice
            order.originalPrice = merchantCart.totalOriginalPrice
            order.discount = merchantCart.totalDiscount
          } else if (mode === 'selected') {
            products = merchantCart.items.filter(item => item.selected)
            order.salePrice = merchantCart.selectedSalePrice
            order.originalPrice = merchantCart.selectedOriginalPrice
            order.discount = merchantCart.selectedDiscount
          }
          if (products) {
            order.userId = userId
            order.merchantId = merchantId
            order.storeName = merchantCart.storeName
            order.payStatus = 'pending'
            order.items = products.map(item => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              originalPrice: item.originalPrice,
              salePrice: item.salePrice,
              totalOriginalPrice: item.totalOriginalPrice,
              totalSalePrice: item.totalSalePrice,
              totalDiscount: item.totalDiscount
            }))
            orders.push(order)
          }
        }
      } else {
        // 生成多个商家的订单，遍历所有商家
        state.cartItems.forEach(merchantCart => {
          const products = merchantCart.items.filter(item => item.selected)
          if (products) {
            const order = {
              userId: userId,
              merchantId: merchantCart.merchantId,
              storeName: merchantCart.storeName,
              payStatus: 'pending',
              items: products.map(item => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                originalPrice: item.originalPrice,
                salePrice: item.salePrice,
                totalOriginalPrice: item.totalOriginalPrice,
                totalSalePrice: item.totalSalePrice,
                totalDiscount: item.totalDiscount
              })),
              salePrice: merchantCart.selectedSalePrice,
              originalPrice: merchantCart.selectedOriginalPrice,
              discount: merchantCart.selectedDiscount
            }
            orders.push(order)
          }
        })
      }
      if (orders.length > 0) {
        state.orders = orders
      }
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
    // 返回购物车中所有商家所有的数量
    cartTotalQuantity (state) {
      // 累加每个商家购物车中商品的数量
      return state.cartItems.reduce((total, merchantCart) => {
        return total + merchantCart.items.reduce((sum, item) => sum + item.quantity, 0)
      }, 0)
    },
    // 获取购物车中所有商家的数量
    cartTotalMerchants (state) {
      // 由于每个商家购物车条目是唯一的，所以直接返回商家购物车条目的数量
      return state.cartItems.length
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
    },
    cartItems: state => state.cartItems,
    totalOriginalPrice: state => state.totalOriginalPrice,
    totalSalePrice: state => state.totalSalePrice,
    selectedOriginalPrice: state => state.selectedOriginalPrice,
    selectedSalePrice: state => state.selectedSalePrice,
    totalDiscount: state => state.totalDiscount,
    orders: state => state.orders
  }
}
