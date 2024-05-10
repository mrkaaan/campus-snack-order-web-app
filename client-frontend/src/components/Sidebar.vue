<template>
  <div
    :class="{
      'is-open': isSidebarOpen,
      'is-drawer': isSidebarDrawer && !isSmallScreen,
      // 'is-collapsed': isSidebarCollapsed && !isSmallScreen,
      'is-hidden': isSmallScreen
    }"
    style="width: 100%"
  >
    <transition name="slide">
      <div class="header-title normal-title">
        <h2>{{ headerTitle }}</h2>
      </div>
    </transition>
    <ul class="menu">
      <li class="menu-wrapper" v-for="item in menuItems" :key="item.route" @click="handleSelect(item) "
          :class="{'cannot-click' :item.id === 'merchant' && merchantTags.length === 0,'is-active': activeRoute === item.route, 'is-collapsed': isSidebarCollapsed && !isSmallScreen}"
          :style="{'cursor' :(item.id === 'merchant' && merchantTagsCount === 0) ? 'default' : 'pointer'}"
      >
        <div class="item-selected">
        </div>
        <div class="menu-item" :style="{'cursor' :(item.id === 'merchant' && merchantTagsCount === 0) ? 'default' : 'pointer'}">
          <el-badge v-if="item.badge" :value="item.badge" class="item-icon">
            <i :class="[item.icon, 'big-icon-size']"></i>
          </el-badge>
          <template v-else>
            <i :class="[item.icon, 'big-icon-size', 'item-icon']" :style="{'cursor' :(item.id === 'merchant' && merchantTagsCount === 0) ? 'default' : 'pointer'}"></i>
          </template>
          <transition name="slide">
            <span v-show="!isSidebarCollapsed || isSidebarDrawer" :style="{'cursor' :(item.id === 'merchant' && merchantTagsCount === 0) ? 'default' : 'pointer'}">{{ item.name }}</span>
          </transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Sidebar',
  data () {
    return {
      currenBottomNavTag: 'home' // 当前选中的标签页
    }
  },
  methods: {
    handleSelect (item) {
      if (item.id !== 'merchant') {
        this.$router.push(item.route)
      } else if (item.id === 'merchant') {
        console.log('merchantTag', this.merchantTags)
        console.log('merchantTag', this.merchantTags[-1])
        if (this.merchantTags.length !== 0) {
          this.$router.push({ name: 'merchantDetails', params: { merchantId: this.merchantTags[this.merchantTags.length - 1].merchantId } })
        }
      }
    }
  },
  props: {
    isSidebarOpen: Boolean,
    isSidebarDrawer: Boolean,
    isSidebarCollapsed: Boolean,
    isSmallScreen: Boolean
  },
  computed: {
    ...mapState('merchant', ['merchantTags']),
    ...mapGetters('cart', ['cartTotalMerchants', 'cartTotalQuantity']),
    ...mapGetters('merchant', ['merchantTagsCount']),
    headerTitle () {
      return this.isSidebarCollapsed ? 'Del.' : 'Delicious.'
    },
    activeRoute () {
      if (this.$route.path.startsWith('/merchant/')) {
        return '/merchant' // 强制返回主页路由以高亮主页菜单项
      }
      return this.$route.path === '/' ? '/home' : this.$route.path
    },
    menuItems () {
      return [
        { id: 'home', icon: 'el-icon-house', name: '主页', route: '/home', badge: 0 },
        { id: 'merchant', icon: 'el-icon-shopping-bag-2', name: '商店', route: '/merchant', badge: this.merchantTagsCount },
        { id: 'cart', icon: 'el-icon-shopping-cart-full', name: '购物车', route: '/cart', badge: this.cartTotalQuantity },
        { id: 'profile', icon: 'el-icon-user', name: '我的', route: '/profile', badge: 0 },
        { id: 'order', icon: 'el-icon-s-order', name: '订单', route: '/order', badge: 0 }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';
.header-title {
  padding: 1rem;

}

.menu {
  list-style: none;
  display: flex;
  gap: 20px;
  flex-direction: column;

  .menu-wrapper {
    display: flex;
    flex-wrap: nowrap;
    .menu-item {
      display: flex;
      gap: 1rem;
      height: 80px;
      width: 100%;
      align-items: center;
      padding: 10px 0 0 25px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;

      i {
        margin-right: 8px;
      }
      span {
        white-space: nowrap;
        font-size: 1.2rem;
        font-weight: 800;
      }
    }
    .item-selected {
      height: 80px;
      width: 0;
      background-color: $green-light3;
    }
    &:not(.is-active) {
      .item-selected {
        //width: 0;
        transition: width 0.3s ease;
      }
    }
    &.is-active {
      .item-selected {
        width: 15px;
        transition: width 0.3s ease;
      }
      .menu-item {
        font-weight: bold;
        .item-icon{
          color: $green;
        }
        span {
          color: $green;
        }
      }

      &.is-collapsed {
        .item-selected {
          position:absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          //left: 29px;
          border-radius: 25%;
          padding: 15px;
          //height: 100%;
          width: 100%;
          transition: all 0.3s ease;

        }
        .item-icon{
          color: $primary-color;
        }
        span {
          color: $primary-color;
        }
      }
    }
  }
}

.is-collapsed {
}
.is-open {
}
.is-drawer {
}
/* 小屏模式 */
.is-hidden {
  display: none; /* 隐藏侧边栏 */
}
/* 文字消失和显示 */
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.1s;
  opacity: 1;
}
.slide-enter, .slide-leave-to {
  opacity: 0;
}

.cannot-click {
  cursor: default;
  color: #909399;
}
</style>
