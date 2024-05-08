<template>
  <div class="cart-page">
    <div class="cart-page-wrapper" :style="cartPageWrapperStyles">
      <div class="cart-category" v-for="(cate, cateIndex) in cartItems" :key="cateIndex">
        <div class="cart-category-t">
          <div class="cart-item-select-all">
            <div :class="['select-box',{ 'is-selected': cate.selected}]" @click="selectAllInCategory(cateIndex)">
              <i :class="['el-icon-check btn']"></i>
            </div>
            <div class="cart-title">
              {{ cate.name }}
              <i class="el-icon-arrow-right btn"></i>
            </div>
          </div>
          <div class="cart-item-clear-all">
            <div class="clear-box">
              <i class="el-icon-delete btn"></i>
            </div>
          </div>
        </div>
        <div class="cart-category-b">
          <div class="cart-item" v-for="(item, itemIndex) in cate.items" :key="itemIndex">
            <div :class="['select-box',{ 'is-selected': item.selected}]" @click="selectItem(cateIndex, itemIndex)">
              <i :class="['el-icon-check btn']"></i>
            </div>
            <div class="cart-item-desc">
              <div class="cart-item-image">
                <img src="" alt="">
              </div>
              <div class="cart-item-info">
                <div class="cart-item-name">
                  {{ item.name }}
                </div>
                <div class="cart-item-info-b">
                  <div class="cart-item-price">
                    <span class="sale-price" v-if="item.salePrice" :class="{ 'item-price': item.salePrice }">
                      ￥{{ item.salePrice }}
                    </span>
                    <span v-if="item.originalPrice" :class="item.salePrice ? 'original-price' : 'item-price'">
                      ￥{{ item.originalPrice }}
                    </span>
                  </div>
                  <div class="cart-item-count">
                    <div @click="toggleVisibility(item, cate.merchantId)" v-if="!item.isShowStepper" class="count">
                      {{ `x ${item.quantity}`}}
                    </div>
                    <el-input-number v-else size="mini" v-model="item.quantity" :min="0" :max="99" label="描述文字"></el-input-number>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--    总价和结账的容器 -->
    <transition name="slide">
      <div class="cart-total-container" v-if="isShowCheckOut" :style="totalContainerStyles">
        <div class="cart-total-container-wrapper" :style="totalContainerWrapperStyles">
          <div class="cart-total">
            <div :class="['select-box',{ 'is-selected': allSelected}]" @click="selectAll">
              <i :class="['el-icon-check btn']"></i>
            </div>
            <div class="cart-total-price" v-if="summary.total" @click="handelExpandDetails">
              <div class="cart-total-title">合计</div>
              <span class="sale-price" v-if="summary.total" :class="{ 'item-price': summary.total }">
                ￥{{ summary.total }}
              </span>
              <span  class="original-price" v-if="summary.totalOriginal">
                ￥{{ summary.totalOriginal }}
              </span>
              <span class="cart-total-text" v-if="summary.total">
                明细
                <i :class="isCheckOutLaunch ? 'el-icon-arrow-down': 'el-icon-arrow-up'"></i>
              </span>
            </div>

          </div>
          <div class="cart-checkout">
            <el-button type="primary" size="mini" class="btn">
              结账
            </el-button>
          </div>
          <transition name="slide">
            <div class="cart-total-details" v-if="isCheckOutLaunch" :style="totalDetailsStyles">
              <div class="cart-total-details-wrapper">
                <div class="cart-total-details-title">价格明细</div>
                <div v-for="i in 100" :key="i" class="cart-total-details-items">
                  <div class="cart-total-details-item-name">
                    {{ `Item ${i}` }}
                  </div>
                  <div class="cart-total-details-item-price">
                    <span class="sale-price" v-if="i">
                      ￥{{ i }}
                    </span>
                    <span  class="original-price" v-if="i">
                      ￥{{ i }}
                    </span>
                  </div>
                </div>
              <!--              <div class="cart-total-details-items" v-for="(cate, index) in summary.cate" :key="index">-->
              <!--                <div class="cart-total-details-item-name">-->
              <!--                  {{ cate.name }}-->
              <!--                </div>-->
              <!--                <div class="cart-total-details-item-price">-->
              <!--                  <span class="sale-price" v-if="cate.total" :class="{ 'item-price': cate.total }">-->
              <!--                    ￥{{ cate.total }}-->
              <!--                  </span>-->
              <!--                  <span  class="original-price" v-if="cate.totalOriginal">-->
              <!--                    ￥{{ cate.totalOriginal }}-->
              <!--                  </span>-->
              <!--                </div>-->
              <!--              </div>-->
              </div>
            </div>
          </transition>
        </div>
      </div>

    </transition>
    <!--    <div class="masking-box" v-if="isCheckOutLaunch" @click="handelCloseDetails"></div>-->
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'CartPage',
  computed: {
    // ...mapGetters('cart', ['cartItems']),
    ...mapGetters('sidebar', ['isSmallScreen', 'isWideScreen', 'isMediumScreen']),
    ...mapState('sidebar', ['isSidebarCollapsed']),
    ...mapGetters('cart', ['getAllCartItems']),
    cartItems () {
      const cartItems = this.getAllCartItems
      console.log(cartItems)
      return cartItems
    },
    totalDetailsStyles () {
      const style = {}
      if (this.isSmallScreen) {
        style.padding = '0'
        style.height = '350%'
      } else if (this.isMediumScreen) {
        ;
      } else {
        ;
      }
      return style
    },
    totalContainerStyles () {
      const style = {}
      if (this.isSmallScreen) {
        style.bottom = '4rem'
        style.width = '80%'
      } else if (this.isMediumScreen) {
        style.width = '100%'
        style.padding = '0 1rem'
        style.bottom = '1rem'
      } else if (this.isWideScreen) {
        if (this.isSidebarCollapsed) {
          style.width = 'calc(100% - 5rem)'
        } else {
          style.width = 'calc(100% - 15.625rem)'
        }
        style.padding = '0 1rem'
        style.bottom = '1rem'
      }
      return style
    },
    totalContainerWrapperStyles () {
      if (this.isCheckOutLaunch) {
        return {
          borderRadius: '0 0 1rem 1rem'
        }
      } else {
        return {
          borderRadius: '1rem'
        }
      }
    },
    cartPageWrapperStyles () {
      const style = {
        paddingBottom: '5.3rem'
      }
      if (this.isSmallScreen) {
        if (this.isShowCheckOut) {
          style.paddingBottom = '8rem'
        }
      } else if (this.isMediumScreen) {
        if (!this.isShowCheckOut) {
          style.paddingBottom = '1rem'
        }
      } else if (this.isWideScreen) {
        if (!this.isShowCheckOut) {
          style.paddingBottom = '1rem'
        }
      }
      return style
    },
    allSelected () {
      return this.cartItems.every(cate => cate.items.every(item => item.selected))
    }
  },
  data () {
    return {
      isShowCheckOut: true,
      isCheckOutLaunch: false,

      // cartItems: [
      //   {
      //     selected: false,
      //     name: 'Mobile Phones',
      //     items: [
      //       {
      //         name: 'Apple iPhone 13',
      //         image: 'https://example.com/iphone13.jpg',
      //         quantity: 1,
      //         originalPrice: 699,
      //         salePrice: 599,
      //         selected: false,
      //         isShowStepper: false
      //       },
      //       {
      //         name: 'Samsung Galaxy S22',
      //         image: 'https://example.com/galaxys22.jpg',
      //         quantity: 1,
      //         originalPrice: 799,
      //         salePrice: null, // No discount
      //         selected: false,
      //         isShowStepper: false
      //       }
      //     ]
      //   },
      //   {
      //     selected: false,
      //     name: 'Electronics',
      //     items: [
      //       {
      //         name: 'Apple MacBook Air',
      //         image: 'https://example.com/macbookair.jpg',
      //         quantity: 1,
      //         originalPrice: 999,
      //         salePrice: 949,
      //         selected: false,
      //         isShowStepper: false
      //       },
      //       {
      //         name: 'Dell XPS 13',
      //         image: 'https://example.com/dellxps13.jpg',
      //         quantity: 1,
      //         originalPrice: 899,
      //         salePrice: null, // No discount
      //         selected: false,
      //         isShowStepper: false
      //       }
      //     ]
      //   },
      //   {
      //     selected: false,
      //     name: 'Clothing',
      //     items: [
      //       {
      //         name: 'Nike Running Shoes',
      //         image: 'https://example.com/nikerunning.jpg',
      //         quantity: 2,
      //         originalPrice: 120,
      //         salePrice: 100,
      //         selected: false,
      //         isShowStepper: false
      //       },
      //       {
      //         name: 'Adidas Soccer Shoes',
      //         image: 'https://example.com/adidassoccer.jpg',
      //         quantity: 1,
      //         originalPrice: 150,
      //         salePrice: 135,
      //         selected: false,
      //         isShowStepper: false
      //       }
      //     ]
      //   }
      // ],
      total: 0,
      summary: {
        total: 0,
        totalOriginal: 0,
        cate: [
          // {
          //   name: '',
          //   total: 0,
          //   totalOriginal: 0
          // }
        ]
      }
    }
  },
  methods: {
    ...mapActions('mask', ['showOverlay', 'hideOverlay']),
    ...mapActions('cart', ['updateIsExpanded', 'addToCart', 'removeFromCart']),
    handelExpandDetails () {
      this.isCheckOutLaunch = !this.isCheckOutLaunch
      if (this.isCheckOutLaunch) {
        this.showOverlay(() => {
          this.isCheckOutLaunch = false
        })
      } else {
        this.hideOverlay()
      }
    },
    handelCloseDetails () {
      if (this.isCheckOutLaunch) {
        this.isCheckOutLaunch = false
      }
    },
    selectedProduct () {
      this.isShowCheckOut = !this.isShowCheckOut
    },
    selectAllInCategory (cateIndex) {
      const state = !this.cartItems[cateIndex].selected
      this.cartItems[cateIndex].selected = state
      this.cartItems[cateIndex].items.forEach(item => { item.selected = state })
      this.updateTotal()
    },
    selectItem (cateIndex, itemIndex) {
      const item = this.cartItems[cateIndex].items[itemIndex]
      item.selected = !item.selected
      // 检查当前分类是否全选
      const isAllSelected = this.cartItems[cateIndex].items.every(item => item.selected)
      this.cartItems[cateIndex].selected = !!isAllSelected
      this.updateTotal()
    },
    selectAll () {
      const newState = !this.allSelected
      this.cartItems.forEach(cate => {
        cate.selected = newState
        cate.items.forEach(item => {
          item.selected = newState // 单独进行赋值操作
        })
      })
      this.updateTotal()
    },
    updateTotal () {
      // 重置总计和每个分类的总计
      this.summary.total = 0
      this.summary.totalOriginal = 0
      // 重置每个分类的统计数据
      this.summary.cate = this.summary.cate.filter(c => false) // 清空现有分类统计
      // this.summary.cate = []

      // 遍历所有分类和商品
      this.cartItems.forEach((cate, index) => {
        cate.items.forEach(item => {
          if (item.selected) {
            // 累加选中商品的总价和总原价
            this.summary.total += (item.salePrice || item.originalPrice) * item.quantity
            if (!item.salePrice) {
              this.summary.totalOriginal += 0
            } else {
              this.summary.totalOriginal += item.originalPrice * item.quantity
            }

            // 确保每个分类的统计信息已经初始化
            if (!this.summary.cate[index]) {
              this.summary.cate[index] = { name: cate.name, total: 0, totalOriginal: 0 }
            }
            // 累加当前分类的总价和总原价
            this.summary.cate[index].total += (item.salePrice || item.originalPrice) * item.quantity
            if (!item.salePrice) {
              this.summary.cate[index].totalOriginal += 0
            } else {
              this.summary.cate[index].totalOriginal += item.originalPrice * item.quantity
            }
          }
        })
      })
      console.log('total:', this.summary.total, 'totalOriginal:', this.summary.totalOriginal, 'cate:', JSON.stringify(this.summary.cate))
    },
    toggleVisibility (item, merchantId) {
      this.$store.dispatch('mask/toggleStepperShow', { productId: item.productId, merchantId })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';
.cart-page {
  background-color: $lighter-gray;
  //height: 100%;
  display: flex;
  flex-direction: column;
  //align-items: center;
  .cart-page-wrapper {
    padding: 2rem 1rem 0;
    //padding-top: 2rem;
    //padding-left: 1rem;
    //padding-right: 1rem;
    //padding-bottom: 5.3rem;
    display: flex;
    transition: padding 0.3s ease-in-out, padding-bottom 0.3s ease-in-out;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
}
.cart-category {
  background-color: $primary-color;
  width: 100%;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  .cart-category-t {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .cart-item-select-all {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
  .cart-title {
    font-size: 120%;
    font-weight: bold;
    cursor: pointer;
    .btn {
      font-weight: bold;
      font-size: 90%;
    }
  }

  .cart-category-b {
    display: flex;
    flex-direction: column;
    gap: 1rem;

  }
  .cart-item {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;

    .cart-item-desc {
      flex: 1;
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
    }
    .cart-item-image {
      height: 5rem;
      width: 5rem;
      background-color: #666666;
    }
    .cart-item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .cart-item-name {
        align-self: start;
        font-size: 110%;
        font-weight: bold;
      }
      .cart-item-info-b {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .cart-item-count {
          width: 5.5rem;
          .count {
            border: 1px solid $light-gray;
          }
          .el-input-number--mini {
            width: 100%;
          }
        }
      }
    }
  }
}

.select-box{
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $light-gray;
  background-color: transparent;
  transition: border 0.3s ease-in-out, background-color 0.3s ease-in-out;
  &:hover {
    border: 2px solid $green-light3;
  }
  .btn {
    //font-size: 120%;
    font-weight: bold;
    color: $primary-color;
    opacity: 0;
    transition: color 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }
}
  .is-selected {
    border: 2px solid $green-light3;
    background-color: $green-light3;
    .btn {
      opacity: 1;
    }
  }

.sale-price {
}
.item-price {
  font-weight: bold;
  color: $red; /* 突出显示售价 */
}
.original-price {
  text-decoration: line-through;
  color: $gray; /* 原价的颜色和删除线 */
  font-size: 80%;
}

.cart-item-clear-all {
  cursor: pointer;
  color: $medium-gray;
  transition: color 0.3s ease-in-out;
  &:hover {
    color:#000;
  }
}

.cart-total-container {
  z-index: 1110;
  align-self: center;
  position: fixed;
  transition: bottom 0.3s ease-in-out, width 0.3s ease-in-out;
  //bottom: 4rem;
  //width: 80%;
  .cart-total-container-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: $primary-color;
    padding: 1rem;
    border-radius: 1rem;
  }
  .cart-total {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    z-index: 1200;
  }
  .cart-checkout {
    display: flex;
    flex-direction: row;
    z-index: 1200;
  }
  .cart-total-price {
    display: flex;
    flex-direction: row;
    align-items: end;
    flex: 1;
    cursor: pointer;
    gap: 1rem;
  }
  .cart-total-title {
    font-size: 120%;
  }
  .cart-total-text {
    font-size: 80%;
  }
}

.cart-total-details {
  z-index: 1150;
  padding: 0 1rem;
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: 550%;
  //background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: padding 0.3s ease-in-out, height 0.3s ease-in-out;

  .cart-total-details-wrapper {
    background-color: $primary-color;
    border-radius: 1rem 1rem 0 0;
    padding: 1rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .cart-total-details-title {
      font-size: 120%;
      font-weight: bold;
      text-align: center;
    }
    .cart-total-details-items {
      overflow: scroll;
      scrollbar-width: none;
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

//.masking-box {
//  position: absolute;
//  top: 0;
//  left: 0;
//  margin: 0;
//  right: 0;
//  bottom: 0;
//  width: 100%;
//  height: 100%;
//  background-color: rgba(0, 0, 0, 0.5);
//  display: flex;
//  justify-content: center;
//  align-items: center;
//
//  //background-color: rgba(0, 0, 0, 0.7);
//  z-index: 109;
//  transition: opacity .3s;
//}
</style>
