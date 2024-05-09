<!-- CartComponent.vue -->
<template>
  <div class="cart-container" :style="cartContainerStyles">
    <div class="cart-container-wrapper">
      <transition name="slide">
        <div class="cart-details" v-if="isExpanded" :style="cartDetailsStyles">
          <div class="cart-details-wrapper">
            <h1 class="cart-title">已选商品</h1>
            <div class="cart-items">
              <div class="cart-item" v-for="(item, item_id) in cartItems" :key="item_id">
                <div class="cart-item-wrapper">
                  <div class="cart-item-image">
                    <img src="https://via.placeholder.com/100x100?text=image" alt="Product Image">
                  </div>
                  <div class="cart-item-info">
                    <div class="cart-item-info-t">
                      <h3 class="cart-item-title">{{ item.name }}</h3>
                      <p class="cart-item-desc">{{ item.description }}</p>
                    </div>
                    <div class="cart-item-info-b">
                      <div class="cart-item-price">
                        <span class="sale-price" v-if="item.totalSalePrice" :class="{ 'item-price': item.totalSalePrice}">
                          ￥ {{ item.totalSalePrice}}
                        </span>
                        <span  :class="item.totalSalePrice ? 'original-price' : 'item-price'">
                          ￥ {{ item.totalOriginalPrice}}
                        </span>
                      </div>
                      <div class="cart-item-quantity">
                        <div class="controls-wrapper">
                          <div class='add icon' @click="decrement(item)"><i class="el-icon-minus"></i></div>
                          <span class="item-quantity">{{ item.quantity }}</span>
                          <div class='sub icon' @click="increment(item)"><i class="el-icon-plus"></i></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <div class="cart-summary" :style="cartSummaryStyles">
        <div class="cart-summary-wrapper">
          <div class="cart-summary-l" @click="toggleCart">
            <div class="cart-summary-l-wrapper">
              <div class="cart-sum-icon"><i class="el-icon-shopping-bag-2"></i></div>
              <div class="cart-sun-info">
                <div class="cart-sum-info-t">
                  <span>￥ {{ totalSalePrice }} </span>
                  <i v-if="totalSalePrice" :class="isExpanded ? 'el-icon-arrow-down': 'el-icon-arrow-up'"></i>
                </div>
                <div class="cart-sum-info-b" v-if="totalSalePrice" >
                  <p>￥ {{ totalOriginalPrice }} </p>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-summary-r">
            <div class="cart-summary-r-wrapper">
              <div class="cart-sum-btn">去结算</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'CartComponent',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('mask', ['showOverlay', 'hideOverlay']),
    ...mapActions('cart', ['updateIsExpanded', 'addToCart', 'removeFromCart']),
    toggleCart () {
      if (!this.totalSalePrice) {
        return
      }
      const isExpanded = !this.isExpanded
      this.updateIsExpanded(isExpanded)
      if (isExpanded) {
        this.showOverlay(() => {
          this.updateIsExpanded(false)
        })
      } else {
        this.hideOverlay()
      }
    },
    increment (item) {
      this.$store.dispatch('cart/addToCart', {
        item,
        merchant: {
          merchantId: this.merchantId,
          storeName: this.storeName
        }
      })
    },
    decrement (item) {
      // 逻辑减少item的数量，确保数量不会小于0
      if (item.quantity > 0) {
        this.removeFromCart({
          item, merchant: { merchantId: this.merchantId, storeName: this.storeName }
        })
      }
    }
  },
  props: ['merchantId', 'storeName'],
  computed: {
    ...mapGetters('cart', ['isExpanded']),
    ...mapGetters('sidebar', ['isSmallScreen', 'isWideScreen', 'isMediumScreen']),
    ...mapGetters('cart', ['cartByMerchant', 'getTotalSalePriceByMerchant', 'getTotalOriginalPriceByMerchant']),
    ...mapState('sidebar', ['isSidebarCollapsed']),
    total () {
      return this.items.reduce((acc, item) => acc + item.price, 0)
    },
    cartContainerStyles () {
      const style = {}
      if (this.isSmallScreen) {
        style.height = '13%'
        style.width = '100%'
      } else if (this.isMediumScreen) {
        style.height = '13%'
      } else if (this.isWideScreen) {
        style.height = '6rem'
        if (this.isSidebarCollapsed) {
          style.width = 'calc(100% - 5rem)'
        } else {
          style.width = 'calc(100% - 15.625rem)'
        }
      }

      // if (this.isExpanded) {
      //   style.overflow = 'hidden'
      // } else {
      //   style.overflow = 'visible'
      // }
      return style
    },
    cartDetailsStyles () {
      // const style = {}
      // if (this.isExpanded) {
      //   style.bottom = '-400%'
      // } else {
      //   style.bottom = '100%'
      // }
      return { }
    },
    cartSummaryStyles () {
      const style = {}
      if (this.isExpanded) {
        style.backgroundColor = '#ffffff'
      } else {
        style.backgroundColor = 'transparent'
      }
      return style
    },
    cartItems () {
      return this.cartByMerchant(this.merchantId)
    },
    totalOriginalPrice () {
      return this.getTotalOriginalPriceByMerchant(this.merchantId)
    },
    totalSalePrice () {
      return this.getTotalSalePriceByMerchant(this.merchantId)
    }
    // cartSummary () {
    //   return this.cartItems.reduce((acc, item) => acc + item.quantity, 0)
    // },
    // cartSummaryPrice () {
    //   return this.cartItems.reduce((acc, item) => acc + item
    // }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.cart-container {
  z-index: 1110;
  position: fixed;
  bottom: 0;
  height: 10rem;
  transition: height 0.2s;
  width: 100%;
  display: flex;
  flex-direction: column;
  //background-color: #42b983;
}
.cart-container-wrapper{
  position: relative;
  width: 100%;
  height: 100%;
}
.cart-details, .cart-summary {
  min-height: 100%;
  flex: 1;
}
.cart-details {
  min-height: 100%;
  position: absolute;
  width: 100%;
  height: 400%;
  border-radius: 1rem 1rem 0 0;
  background-color: $primary-color;
  bottom: 100%;
  z-index: 1099;
  transition: bottom 0.2s;
  box-shadow: -3px -17px 18px -12px rgba(0,0,0,0.1);
}
.cart-details-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0.8rem 0.3rem;

  .cart-title {
    font-size: 140%;
    font-weight: bold;
    padding: 0.8rem 0;
    width: 100%;
  }
  .cart-items {
    height: 100%;
    overflow-y: scroll;
    // 隐藏滚动条
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 0.5rem 0.5rem;
    .cart-item {
      .cart-item-wrapper {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        .cart-item-image {

        }

        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .cart-item-info-t {
            align-self: start;
            display: flex;
            flex-direction: column;
            align-items: start;
          }
          .cart-item-info-b {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
          .cart-item-title {
            font-weight: bold;
            font-size: 120%;
          }
          .cart-item-desc {
            color: $medium-gray;
            font-size: 80%;
          }
          .cart-item-price {
            display: flex;
            flex-direction: row;
            align-items: end;

            .item-price {
              font-weight: bold;
              color: $red; /* 突出显示售价 */
            }
            .original-price {
              text-decoration: line-through;
              color: $gray; /* 原价的颜色和删除线 */
              font-size: 80%;
            }
          }
          .controls-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            gap: 0.8rem;
            .icon {
              background-color: #4CAF50; /* 按钮颜色 */
              border: none;
              color: white;
              height: 1.5rem;
              width: 1.5rem;

              font-size: 1rem;
              cursor: pointer;
              border-radius: 0.5rem; /* 按钮圆角 */
            }
          }
        }
      }
    }
  }
}
.cart-summary {
  cursor: pointer;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
  z-index: 1100;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: start;
}
.cart-summary-wrapper {
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
  height: 90%;
  width: 98%;
  border-radius: 2rem;
  background-color: $green-light3;

  z-index: 1101;
  display: flex;
  flex-direction: row;
  //overflow: hidden;

  .cart-summary-l {
    flex: 7;
    background-color: $dark-gray;
    height: 100%;
    padding: 0 2rem;
    display: flex;
    flex-direction: row;
    border-radius: 2rem;

    .cart-summary-l-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }
  }
  .cart-summary-r {
    flex:3;
    display: flex;
    flex-direction: row;
    .cart-summary-r-wrapper {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 120%;
    }
  }

  .cart-sum-icon {
    color: $green-light3;
    font-weight: bold;
    font-size: 180%;
    transform:translateY(-10%)
  }

  .cart-sun-info {
    color: $primary-color;
    display: flex;
    flex-direction: column;
    align-items: start;

    .cart-sum-info-b {
      font-size: 70%;
    }
  }

}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s, bottom 0.3s ease-in-out, opacity 0.3s;
}

.slide-enter, .slide-leave-to {
  //bottom: -400%;
  transform: translateY(100%);
  opacity: 0;
}

.slide-enter-to, .slide-leave {
  //bottom: 100%;
  transform: translateY(0%);
  opacity: 1;
}
</style>
