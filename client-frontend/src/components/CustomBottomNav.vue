<template>
  <BottomNav>
    <div class="nav-background" :style="backgroundPosition">
      <div class="nav-background-content"></div>
    </div>
    <div v-for="item in navItems" :key="item.id" class="nav-item" @click="selectBottomNvaTab(item)" :class="{active: currentBottomNavTag === item.id}"  :style="{'cursor' :(item.id === 'merchant' && merchantTagsCount === 0) ? 'default' : 'pointer', 'color' :(item.id === 'merchant' && merchantTagsCount === 0) ? '#666' : 'black'}">
      <!-- 使用el-badge时判断是否有badge值，且大于0 -->
      <el-badge v-if="item.badge" :value="item.badge" class="nav-icon">
        <i :class="[item.icon, 'big-icon-size']"></i>
      </el-badge>
      <!-- 不显示badge的情况下直接显示图标 -->
      <template v-else>
        <i :class="[item.icon, 'big-icon-size', 'nav-icon']"  :style="{'cursor' :(item.id === 'merchant' && merchantTagsCount === 0) ? 'default' : 'pointer'}"></i>
      </template>
      <span  :style="{'cursor' :(item.id === 'merchant' && merchantTagsCount === 0) ? 'default' : 'pointer'}">{{ item.name }}</span>
    </div>
  </BottomNav>
</template>

<script>
import BottomNav from './BottomNav.vue'
import { mapGetters, mapState } from 'vuex' // 确保路径正确

export default {
  name: 'CustomBottomNav',
  components: {
    BottomNav
  },
  data () {
    return {
      // navItems: [
      //   { id: 'home', icon: 'el-icon-shopping-bag-2', text: '商店', route: '/home', badge: 0 },
      //   { id: 'cart', icon: 'el-icon-shopping-cart-full', text: '购物车', route: '/cart', badge: 5 },
      //   { id: 'message', icon: 'el-icon-chat-line-round', text: '消息', route: '/message', badge: 3 },
      //   { id: 'profile', icon: 'el-icon-user-solid', text: '我的', route: '/profile', badge: 0 }
      // ]
      currentBottomNavTag: 'home' // 当前选中的标签页
    }
  },
  computed: {
    ...mapState('merchant', ['merchantTags']),
    ...mapGetters('auth', ['mode']),
    ...mapGetters('merchant', ['merchantTagsCount']),
    ...mapGetters('cart', ['cartTotalMerchants', 'cartTotalQuantity']),
    navItems () {
      if (this.mode === 'merchant') {
        return [
          { id: 'orderMerchant', icon: 'el-icon-s-order', name: '订单', route: '/merchant/order', badge: 0 },
          { id: 'check', icon: 'el-icon-edit-outline', name: '编辑商品', route: '/merchant/check', badge: 0 },
          { id: 'searchOrder', icon: 'el-icon-search', name: '搜索订单', route: '/merchant/search', badge: 0 },
          { id: 'profileMerchant', icon: 'el-icon-user', name: '我的', route: '/merchant/profile', badge: 0 }
        ]
      } else {
        return [
          { id: 'home', icon: 'el-icon-house', name: '主页', route: '/user/home', badge: 0 },
          { id: 'merchant', icon: 'el-icon-shopping-bag-2', name: '商店', route: '/user/merchant', badge: this.merchantTagsCount },
          { id: 'searchProduct', icon: 'el-icon-search', name: '搜索商品', route: '/user/search', badge: 0 },
          { id: 'cart', icon: 'el-icon-shopping-cart-full', name: '购物车', route: '/user/cart', badge: this.cartTotalQuantity },
          { id: 'orderUser', icon: 'el-icon-s-order', name: '订单', route: '/user/order', badge: 0 },
          { id: 'profileUser', icon: 'el-icon-user', name: '我的', route: '/user/profile', badge: 0 }
        ]
      }
    },
    // 计算背景移动的距离
    backgroundPosition () {
      const style = {}
      const navNumber = this.navItems.length
      style.width = `calc(100% / ${navNumber})`
      const index = this.navItems.findIndex(item => item.id === this.currentBottomNavTag)
      console.log('位置', index)
      const width = (navNumber * 100) / navNumber // 计算每个nav-item占据的百分比宽度
      style.transform = `translateX(${index * width}%)`
      return style
    }
    // currentBottomNavTag () {
    //   // console.log(this.$route)
    //   if (this.mode === 'merchant') {
    //     if (this.$route.path.startsWith('/merchant/order/')) {
    //       return 'order'
    //     } else if (this.$route.path.startsWith('/merchant/check/')) {
    //       return 'check'
    //     } else if (this.$route.path.startsWith('/merchant/search/')) {
    //       return 'searchProduct'
    //     } else if (this.$route.path.startsWith('/merchant/profile/')) {
    //       return 'profileMerchant'
    //     } else {
    //       return 'order'
    //     }
    //   } else {
    //     if (this.$route.path.startsWith('/user/home/')) {
    //       return 'home'
    //     } else if (this.$route.path.startsWith('/user/merchant/')) {
    //       return 'message'
    //     } else if (this.$route.path.startsWith('/user/search/')) {
    //       return 'searchProduct'
    //     } else if (this.$route.path.startsWith('/user/cart/')) {
    //       return 'cart'
    //     } else if (this.$route.path.startsWith('/user/profile/')) {
    //       return 'profileUser'
    //     } else {
    //       return 'home'
    //     }
    //   }
    // }
  },
  methods: {
    // 选中底部标签
    selectBottomNvaTab (item) {
      if (item.id !== 'merchant') {
        this.$router.push(item.route)
        this.currentBottomNavTag = item.id // 切换选中的标签页
      } else if (item.id === 'merchant') {
        if (this.merchantTags.length !== 0) {
          this.currentBottomNavTag = item.id // 切换选中的标签页
          this.$router.push({ name: 'merchantDetails', params: { merchantId: this.merchantTags[this.merchantTags.length - 1].merchantId } })
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.nav-background {
  z-index: 100;
  text-align: center;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0; /* 根据需要调整 */
  height: 100%; /* 背景块的高度 */
  transition: transform 0.3s ease; /* 平滑过渡效果 */
  .nav-background-content {
    background-color: $green-trans3; /* 背景颜色 */
    height: 80%;
    width: 90%;
    border-radius: 0.9375rem;
  }
}

.nav-item {
  z-index: 101;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  padding: 0.625rem 0;
  transition: all 0.3s ease;

  .nav-icon {
    transform: translateX(0.5rem); /* 假设当span显示时，i标签向右移动1.25rem */
    transition: transform 0.3s ease;
  }
  span {
    opacity: 0;
    transition: opacity 0.3s;
  }
}

.nav-item.active {
  font-weight: bold;

  .nav-icon{
    color: $green;
    transform: translateX(-0.5rem); /* 假设当span显示时，i标签向右移动1.25rem */

  }
  span {
    opacity: 1;
    color: black;
  }
}
</style>
