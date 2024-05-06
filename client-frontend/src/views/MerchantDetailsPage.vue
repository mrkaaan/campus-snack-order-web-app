<template>
  <div style="flex:1;">

    <div class="shop-details-container" :style="shopDetailsContainerStyles" ref="shopDetailsContainer">
      <div class="categories-sticky-container" v-if="currentScroll >= categoriesStickTop" :style="stickyWidth">
        <div class="categories-sticky-wrapper">
          <div class="categories-sticky">
            <ul class="categories" @click="scrollToCategory">
              <li v-for="(category, category_index) in merchantProducts" :id="'left-cat-' + category_index" :key="category_index">
                <div class="category" :class="{active: activeCategory === category_index}">
                  <div class="text-content">{{ category.name }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="categories-temp"></div>
        </div>
      </div>
      <div class="shop-header" :style="headerStyle">
        <div class="header-return">
          <el-button type="text" icon="el-icon-arrow-left" v-if="!isWideScreen" @click="handleReturnToSuperior"></el-button>
        </div>
        <div class="header-wrapper">
          <el-button type="text" icon="el-icon-search"></el-button>
          <el-button type="text" icon="el-icon-message"></el-button>
          <el-button type="text" icon="el-icon-star-off"></el-button>
        </div>
      </div>
      <div class="image-container">
        <img src="https://via.placeholder.com/600x300?text=Shop+Details" alt="Shop Details">
      </div>

      <div class="shop-brand">
        <div class="brand-wrapper">
          <merchant-detail-shop-brand :details="merchantDetails" :loading="isLoadingMerchantDetails" :baseUrl="baseUrl"></merchant-detail-shop-brand>
        </div>
      </div>

      <div class="content" ref="content">
        <div class="content-wrapper">
          <div class="menu" ref="menu">
            <div class="menu-wrapper">
              <div class="selected" :style="{ 'transform': backgroundPosition }">
                <div class="selected-wrapper"/>
              </div>
              <ul>
                <li v-for="(item, item_index) in menuItem" :key="item_index" class="nav-item" @click="selectBottomNvaTab(item_index)" :class="{active: currentBottomNavTag === item_index}">
                  {{ item.text }}
                </li>
              </ul>
            </div>
            <hr/>
          </div>
          <div class="shop-layout">
            <div class="shop-wrapper" :style="{ 'transform': `translateX(-${currentBottomNavTag * 100}%)` }">
              <div class="category-section" v-for="(item, item_index) in menuItem" :key="item_index">
                <div v-if="item.text === '点餐'" class="order-wrapper" :style="{ opacity: currentBottomNavTag === item_index ? '1' : '0' }">
                  <div class="categories-menu">
                    <ul class="categories" @click="scrollToCategory" :style="{ opacity: currentScroll >= categoriesStickTop ? '0' : '1' }">
                      <li v-for="(category, category_index) in merchantProducts" :id="'left-cat-' + category_index" :key="category_index">
                        <div class="category" :class="{active: activeCategory === category_index}">
                          <div class="text-content">{{ category.name }}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="items" @scroll="handleScroll" :style="{ overflowY: allowItemsScroll ? 'scroll' : 'scroll' }">
                    <div v-for="(category, cat_index) in merchantProducts" :id="'cat-' + cat_index" :key="cat_index" class="category-items">
                      <!-- 分类名称区域 -->
                      <div class="category-title">
                        {{ category.name }}
                      </div>
                      <!-- 项目列表区域 -->
                      <div class="category-content">
                        <div v-for="item in category.items" :key="item.productId" class="item">
                          <div class="item-wrapper">
                            <!-- 左侧图片 -->
                            <div class="item-image">
                              <div class="item-image-wrapper">
                                <img src="https://via.placeholder.com/100" alt="商品图片">
                              </div>
                            </div>
                            <!-- 右侧详情和功能按钮 -->
                            <div class="item-details">
                              <div class="item-name">{{ item.name }}</div>
                              <div class="item-detail-wrapper">
                                <div class="item-detail-top">
                                  <div class="item-detail-row">
                                    <div class="item-portion">{{ item.portions || 1 }}人份</div>
                                    <div class="item-description">{{ item.description }}</div>
                                  </div>
                                  <div class="item-sales">月售 {{ item.monthlySales }}+</div>
                                  <div class="item-discount" :style="{ opacity: item.discountInfo!=='1.00' ? '1' : '0' }">{{ item.discountInfo }} 折</div>
                                </div>
                                <div class="item-detail-bottom">
                                  <div class="item-pricing">
                                    <span class="sale-price" v-if="item.salePrice" :class="{ 'item-price': item.salePrice }">
                                      ￥ {{ item.salePrice }}
                                    </span>
                                    <span  :class="item.salePrice ? 'original-price' : 'item-price'">
                                      ￥ {{ item.originalPrice }}
                                    </span>
                                  </div>
                                  <div class="item-quantity-controls">
                                    <div class="controls-wrapper">
                                      <div class='add icon' @click="decrement(item)" v-if="item.quantity"><i class="el-icon-minus"></i></div>
                                      <span class="item-quantity" v-if="item.quantity">{{ item.quantity }}</span>
                                      <div class='sub icon' @click="increment(item)"><i class="el-icon-plus"></i></div>
                                    </div>
                                    <!--                                    <div class="controls-wrapper" v-else>-->
                                    <!--                                      <div class='icon' @click="openOption(item)">选规格</div>-->
                                    <!--                                    </div>-->
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="item.text === '评价'" class="order-wrapper" :style="{ opacity: currentBottomNavTag === item_index ? '1' : '0' }">评价</div>
                <div v-else-if="item.text === '商家'" class="order-wrapper" :style="{ opacity: currentBottomNavTag === item_index ? '1' : '0' }">商家</div>
              </div>
            </div>
          </div>
        </div>
      <!--      <div class="masking-box" v-if="isExpanded" @click="handelCloseCart"></div>-->
      </div>
      <CartComponent :merchantId="merchantDetails.merchantId" :storeName="merchantDetails.storeName"/>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'
import { getMerchant } from '@/api/merchant'
import MerchantDetailShopBrand from '@/components/MerchantDetailShopBrand.vue'
import CartComponent from '@/components/CartComponent.vue'

export default {
  components: { MerchantDetailShopBrand, CartComponent },
  data () {
    return {
      merchant: {}, // 商家详情数据
      startY: 0,
      currentY: 0,
      scale: 1,
      menuItem: [
        { icon: 'el-icon-shopping-bag-2', text: '点餐' },
        { icon: 'el-icon-shopping-cart-full', text: '评价' },
        { icon: 'el-icon-chat-line-round', text: '商家' }
      ],
      merchantDetails: {},
      isLoadingMerchantDetails: false,
      isLoadingMerchantProducts: false,
      activeCategory: null,
      currentBottomNavTag: 0,
      baseUrl: process.env.VUE_APP_BASE_URL,
      categoriesNode: null,
      menuHeight: 0,
      contentTop: 0,
      // 是否打开选规格窗口
      isOpenOption: false,
      currentProduct: null
    }
  },
  computed: {
    ...mapState('header', ['currentScroll', 'lastScroll', 'headerHeight']),
    ...mapGetters('sidebar', ['isWideScreen']),
    ...mapGetters('cart', ['isExpanded']),
    ...mapState('sidebar', ['isSidebarOpen', 'isSidebarCollapsed']),
    ...mapState('merchant', ['currentMerchant']),
    stickyWidth () {
      if (this.isSidebarOpen) {
        return { width: 'calc(100% - 15.625rem)' }
      } else if (this.isSidebarCollapsed) {
        return { width: 'calc(100% - 5rem)' }
      } else {
        return { width: '100%' }
      }
    },
    headerStyle () {
      let opacity = 0 // 初始透明度为0，完全透明
      const effectiveHeight = this.headerHeight || 100 // 如果headerHeight为0或未定义，使用100作为默认高度

      if (this.currentScroll >= 0 && this.currentScroll <= effectiveHeight * 5) {
        // 计算透明度
        opacity = this.currentScroll / effectiveHeight
      } else if (this.currentScroll > effectiveHeight * 5) {
        // 如果滚动距离超过 headerHeight，透明度固定为1
        opacity = 1
      }

      // 计算颜色从白色到黑色的渐变
      const colorValue = Math.floor(255 * (1 - opacity)) // 从 255 (白色) 减到 0 (黑色)
      // 返回用于绑定的样式对象
      return {
        backgroundColor: `rgba(255, 255, 255, ${opacity})`, // 假设背景色为白色，调整透明度
        color: `rgb(${colorValue}, ${colorValue}, ${colorValue})` // 从白色渐变到黑色
      }
    },
    // 计算背景移动的距离
    backgroundPosition () {
      const width = 300 / this.menuItem.length // 计算每个nav-item占据的百分比宽度
      return `translateX(${this.currentBottomNavTag * width}%)`
    },
    // 计算是否允许.items滚动
    allowItemsScroll () {
      // 假设shop-header的高度大约也是headerHeight，需根据实际情况调整
      const baseHeight = this.headerHeight ? this.headerHeight * 2 : 72
      // 第三个吸顶元素与第二个元素之间的距离，转换rem为px
      const additionalDistance = 19 * 16 // 假设1rem等于16px
      // 计算总的吸顶高度
      const totalStickyHeight = baseHeight + additionalDistance
      // console.log('currentScroll', this.currentScroll, 'totalStickyHeight', totalStickyHeight, this.currentScroll > totalStickyHeight)
      return this.currentScroll > totalStickyHeight
    },
    categoriesStickTop () {
      return this.contentTop + this.menuHeight - (this.headerHeight || 72)
    },
    ...mapGetters('sidebar', ['isSmallScreen', 'isWideScreen', 'isMediumScreen']),
    shopDetailsContainerStyles () {
      const style = {}
      if (this.isSmallScreen) {
        style.paddingBottom = '13%'
      } else if (this.isMediumScreen) {
        style.paddingBottom = '13%'
      } else if (this.isWideScreen) {
        style.paddingBottom = '6rem'
      }
      return style
    },
    merchantProducts () {
      return this.$store.state.merchant.merchantProducts
    }
  },
  mounted () {
    this.menuHeight = this.$refs.menu.clientHeight
    this.contentTop = this.$refs.content.offsetTop

    console.log('headerHeight', this.headerHeight || 72)
    const menuHeight = this.$refs.menu.clientHeight
    console.log('menuHeight', menuHeight)
    const contentTop = this.$refs.content.offsetTop
    console.log('contentTop', contentTop)

    console.log('top', contentTop + menuHeight - (this.headerHeight || 72) - menuHeight)

    const orderWrapper = document.querySelector('.order-wrapper')
    console.log('orderWrapperTop', orderWrapper.offsetTop)
  },
  created () {
    this.fetchMerchantDetails()
    this.fetchMerchantProducts()
  },
  watch: {
    currentScroll (newValue, oldValue) {
      // console.log('currentScroll', newValue)
    //   const content = document.querySelector('.content')
    //   const contentOffset = content.offsetTop
    //   //   console.log('contentOffset', contentOffset)
    //   const menuHeight = 3 * 16
    //   //   console.log('menuHeight', menuHeight)
    //   const top = contentOffset + menuHeight - 4.5 * 16
    //   console.log('top', top)
    //
    //   const categoriesStick = document.querySelector('.categories-sticky')
    //   console.log('categoriesLength', categoriesStick)
    //   const categories = document.querySelector('.categories')
    //   const categoriesMenu = document.querySelector('.categories-menu')
    //   console.log('categories', categories)
    //   // console.log('categoriesMenu', categoriesMenu)
    //   // categoriesStick.removeChild(categoriesStick.firstChild)
    //
    //   if (newValue >= top) {
    //     if (categoriesStick.hasChildNodes()) {
    //       // categoriesStick.removeChild(categoriesStick.firstChild)
    //       this.categoriesNode = categories
    //     } else {
    //       categoriesStick.appendChild(categories)
    //     }
    //   } else {
    //     if (categoriesStick.hasChildNodes()) {
    //       categoriesMenu.append(this.categoriesNode)
    //       console.log('移除')
    //       categoriesStick.removeChild(categoriesStick.firstChild)
    //     }
    //   }
    }
  },
  methods: {
    ...mapActions('cart', ['updateIsExpanded', 'addToCart', 'removeFromCart']),
    handelCloseCart () {
      console.log('handelCloseCart')
      if (this.isExpanded) {
        this.updateIsExpanded(false)
      }
      console.log('handelCloseCart', this.isExpanded)
    },
    // handleStickyDom (model) {
    // const content = document.querySelector('.content')
    // const contentOffset = content.offsetTop
    // //   console.log('contentOffset', contentOffset)
    // const menuHeight = 3 * 16
    // //   console.log('menuHeight', menuHeight)
    // const top = contentOffset + menuHeight - 4.5 * 16
    // console.log('top', top)
    //
    // if (model === 'isSticky') {
    //
    // } else (model === 'isNotSticky') {
    //
    // }
    // },
    selectBottomNvaTab (index) {
      this.currentBottomNavTag = index
    },
    scrollToCategory (event) {
      // 获取被点击的分类元素的ID
      const targetId = event.target.closest('li').id
      // 提取数字部分，假设格式为 'left-cat-1'
      const categoryId = targetId.split('-')[2]
      console.log('categoryId', categoryId)
      const categoryElement = this.$el.querySelector(`#cat-${categoryId}`)
      console.log('categoryElement', categoryElement)
      if (categoryElement) {
        // 计算需要滚动到的位置
        const topPos = categoryElement.offsetTop
        console.log('topPos', topPos)
        // 滚动到对应位置
        this.$el.querySelector('.items').scrollTop = topPos - this.$el.querySelector('.items').offsetTop
      } else {
        console.log('Category element not found')
      }
    },
    handleScroll (event) {
      // const scrollPosition = event.target.scrollTop
      // for (const category of this.categories) {
      //   const element = document.getElementById('cat-' + category.id)
      //   if (scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
      //     this.activeCategory = category.id
      //     break
      //   }
      // }
    },
    handleReturnToSuperior () {
      // 检查浏览历史中是否有超过一个记录
      if (window.history.length > 1) {
        // 有足够的历史记录，尝试回退
        this.$router.go(-1)
      } else {
        // 没有足够的历史记录，跳转到首页
        this.$router.push('/home')
      }
    },
    increment (item) {
      this.$store.dispatch('cart/addToCart', {
        item,
        merchant: this.merchantDetails
      })
    },
    decrement (item) {
      // 逻辑减少item的数量，确保数量不会小于0
      if (item.quantity > 0) {
        this.removeFromCart({ item, merchant: this.merchantDetails })
      }
    },
    // 选规格窗口打开
    openOption (product) {
      this.isOpenOption = true
      this.currentProduct = product
    },
    async fetchMerchantDetails () {
      this.isLoadingMerchantDetails = true
      const currentMerchantId = this.$route.params.merchantId
      if (this.currentMerchant && currentMerchantId === this.currentMerchant.merchantId) {
        console.log('Using cached merchant details')
        this.merchantDetails = this.currentMerchant
        this.isLoadingMerchantDetails = false
      } else {
        try {
          console.log('Fetching merchant details')
          const response = await getMerchant(currentMerchantId)
          this.merchantDetails = response.data
          console.log('merchantDetails', this.merchantDetails)
        } catch (error) {
          console.error('Error fetching merchant details:', error)
        } finally {
          this.isLoadingMerchantDetails = false
        }
      }
    },
    async fetchMerchantProducts () {
      this.isLoadingMerchantProducts = true
      try {
        const currentMerchantId = this.$route.params.merchantId
        console.log('currentMerchantId', currentMerchantId)
        await this.$store.dispatch('merchant/fetchProducts', currentMerchantId)
        this.isLoadingMerchantProducts = false
      } catch (error) {
        console.error('Error fetching merchant products:', error)
        this.isLoadingMerchantProducts = false
      }
      console.log('merchantProducts', this.merchantProducts)
    },
    handleAddToCart (product) {
      // 处理添加到购物车的逻辑
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';
.categories-sticky-container {
  position: fixed;
  top: 6rem;
  //left:1rem;
  z-index: 1000;
  padding: 0 1rem;
  width:100%;
  transition: width 0.05s;
  .categories-sticky-wrapper {
    display: flex;
  }
}
.categories-sticky{

  background-color: $light-gray;
  height: inherit;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: start;
  flex:1;
}
.categories-temp {
  width: 80%;
}
.categories-menu {
  background-color: $light-gray;
  height: inherit;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: start;
  flex:1;
  z-index: 999;

}

.categories {
  background-color: $light-gray;
  width: 100%;
  height: inherit;
  flex:1;

  display: flex;
  flex-direction: column;
  justify-content: start;

  li {
    cursor: pointer;
    padding: 0.5rem 0;
    height: 3rem;
    background-color: $light-gray;
    border-radius: 1rem;
    position: relative;
    z-index: 200; // 设置默认 z-index 较高
    .category {
      background-color: $light-gray;
      height: 100%;
      transition: transform 0.3s;
      transform-origin: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:hover {
      z-index: 199; // 提升 hover 的 li 的 z-index
      .category {
        transform: scaleY(2);
        background-color: $primary-color;
      }
      .text-content {
        transform: scaleY(0.5); // 反向缩放以抵消 hover-target 的放大
      }
    }
    .text-content {
      transition: transform 0.3s; // 平滑过渡效果
    }
  }
}
.shop-details-container {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .shop-header {
    position: sticky;
    top: 0;
    transition: background-color 0.3s;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 0.4rem;
    padding:0.5rem 1rem;
    color: white;
    .header-return {
      color: inherit;

      .el-button {
        color: inherit;
        transition: color 0.3s;
        @extend .big-icon-size;
      }
    }
    .header-wrapper{
      height: 3.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      color: inherit;
      .el-button {
        color: inherit;
        transition: color 0.3s;
        @extend .big-icon-size;
      }
    }
  }
  .image-container {
      width: 100%;
      position: absolute;
      //transform: translateY(-4.5rem);
      height: 20rem;
      img {
        width: 100%;
        height: 100%;  // 使图片高度充满容器
        display: block;  // 去除图片下方的空隙
        user-select: none;  // 防止用户选择图片
        pointer-events: none;  // 图片不接受鼠标事件
        object-fit: cover;  // 保持图片的宽高比，多余的部分会被裁剪
      }
  }
  .shop-brand {
    position: relative;
    padding: 6rem 1rem 1rem;
    .brand-wrapper{
      padding: 1rem 2rem;
      background-color: $primary-color;
      width: 100%;
      height: 12rem;
      border-radius: 1rem;
      @extend .box-shadow-3;
    }
  }
  .content {
    padding: 0 1rem;
    flex: 1;
    .content-wrapper {
      @extend .box-shadow-3;
      display: flex;
      flex-direction: column;
      .menu {
        height: 3rem;
        position: sticky;
        top: 3rem; /* 调整此值以适应头部空间或其他元素的高度 */
        z-index: 1001; /* 确保它在滚动时能覆盖其他内容 */
        display: flex;
        flex-direction: column;
        background-color: $primary-color;
        .menu-wrapper{
          height: 100%;
          width: 50%;
          position: relative;
          .selected {
            opacity: 0.8;
            z-index: 100;
            text-align: center;
            position: absolute;
            display: flex;
            justify-content: center;
            bottom: -0.2rem; /* 根据需要调整 */
            height: 10%; /* 背景块的高度 */
            width: calc(100% / 3); /* 假设有4个nav-item */
            transition: transform 0.3s ease; /* 平滑过渡效果 */
            .selected-wrapper{
              background-color: $green-light3;
              height: 100%;
              width: 25%;
              border-radius: 20%;
            }
          }
          ul {
             /* 横向排布ul */
            list-style: none;
            display: flex;
            justify-content: space-around;
            height: 100%;
            align-items: center;
            .active {
              font-weight: bold;

            }

            li {
              cursor: pointer;
              //display: inline;
              width: 100%;
              letter-spacing: 0.5rem;
              text-indent: 0.5rem;
            }
          }
        }
        hr {
          transform: translateY(0.1rem);
        }
      }
      .shop-layout {
        display: flex;
        flex: 1;
        height: inherit;

        position: relative;
        overflow: hidden;
        //overflow-x: hidden;
        //overflow-y: visible;
        clip-path: inset(0);

        width: 100%;

        .shop-wrapper {
          display: flex;
          flex: 1;
          height: inherit;
          transition: transform 0.3s ease-in-out;
          width: 100%;
        }

        .category-section {
          height: inherit;
          min-width: 100%; /* Ensure each section takes full width */
          flex: 1;
          transition: min-width 0.5s cubic-bezier(0.5, 0, 1, 1);
        }
        .order-wrapper {
          display: flex;
          transition: opacity 0.3s ease-in-out;
        }
        .sticky-wrapper {
          top: 6rem; /* 保持和 menu 相同的 top 值确保一致性 */
          z-index: 999;
          //top: 31rem;
          //overflow-y: auto;
          position: sticky;
        }

        .items {
          width: 80%;
          height: 100vh;
          //overflow-y: hidden;
          scrollbar-width: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          .category-items {
            //border: 1px solid gray;
            .category-title {
              display: flex;
              align-items: start;
              padding: 0.5rem 1rem 0;
            }
            .category-content {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              .item {
                //height: 8rem;
                //border: 1px solid $light-gray;
                display: flex;
                justify-content: center;
                align-items: center;
                .item-wrapper {
                  flex: 1;
                  width: 100%;
                  //height: 10rem;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  .item-image {
                    //flex: 1;
                    width: 10rem;
                    flex-shrink: 0; /* 不允许缩小 */
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    object-fit: cover; // 确保图片覆盖整个区域
                    border-radius: 1rem; // 为图片添加圆角，仅左侧
                    overflow: hidden;
                    .item-image-wrapper {
                      background-color: $light-gray;
                      border-radius: 1rem; // 为图片添加圆角，仅左侧
                      //height: 90%;
                      overflow: hidden;
                      width: 90%;
                    }
                    img {
                      width: 100%;
                      height: 100%;
                      object-fit: cover; /* 确保图片不失真 */
                    }
                  }

                  .item-details {
                    flex: 1; /* 使详情部分填充剩余空间 */
                    padding: 0.4rem 0.8rem; /* 与图片间距 */
                    min-width: 0; /* 重要: 在flex容器中避免溢出 */
                    display: flex;
                    height: 100%;
                    flex-direction: column;
                    .item-name {
                      text-align: start;
                      font-weight: bold;
                      //margin-bottom: 0.5rem; /* 给每个部分适当间距 */
                    }
                    .item-detail-wrapper{
                      flex: 1;
                      position: relative;
                      display: flex;
                      flex-direction: column;
                      color: $medium-gray;
                      justify-content: space-between;
                      .item-detail-left {
                        flex:8;
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        gap:0.3rem;
                      }
                      .item-detail-right {
                        flex:2;
                        display: flex;
                        flex-direction: column;
                        justify-content: end;
                        align-items: center;
                      }
                      .item-detail-top {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: start;
                        gap:0.5rem;
                      }
                      .item-detail-bottom {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: end;
                        gap:0.5rem;
                      }
                      .item-detail-row {
                        display: flex;
                        flex-direction: row;
                        gap: 0.5rem;
                        width: 100%;
                      }
                      .item-portion {
                        @extend .tag-gray-1;
                      }
                      .item-description {
                        overflow: hidden; /* 隐藏超出部分的文本 */
                        white-space: nowrap; /* 保持文本在一行内 */
                        text-overflow: ellipsis; /* 超出部分显示省略号 */
                        max-width: 100%; /* 限制最大宽度，防止溢出 */
                        font-size: 90%;
                      }
                      .item-sales {
                        font-size: 80%;
                      }
                      .item-discount {
                        @extend .tag-red-2;
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
                      .item-quantity-controls {
                        //position: absolute;
                        //right: 0;
                        //bottom: 0;
                        color: black;
                        .controls-wrapper {
                          display: flex;
                          flex-direction: row;
                          justify-content: start;
                          align-items: center;
                          gap: 0.3rem;
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
            }
          }
        }
      }
    }
  }
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
//  z-index: 1009;
//  transition: opacity .3s;
//}
</style>
