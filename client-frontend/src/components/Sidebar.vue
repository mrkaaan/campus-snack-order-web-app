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
      <li class="menu-wrapper" v-for="item in menuItems" :key="item.route" @click="handleSelect(item.route)"
          :class="{ 'is-active': activeRoute === item.route, 'is-collapsed': isSidebarCollapsed && !isSmallScreen}">
        <div class="item-selected">
        </div>
        <div class="menu-item">
          <el-badge v-if="item.badge" :value="item.badge" class="item-icon">
            <i :class="[item.icon, 'big-icon-size']"></i>
          </el-badge>
          <template v-else>
            <i :class="[item.icon, 'big-icon-size', 'item-icon']"></i>
          </template>
          <transition name="slide">
            <span v-show="!isSidebarCollapsed || isSidebarDrawer">{{ item.name }}</span>
          </transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data () {
    return {
      menuItems: [
        { id: 'home', icon: 'el-icon-house', name: '主页', route: '/home', badge: 0 },
        { id: 'shop', icon: 'el-icon-shopping-bag-2', name: '商店', route: '/shop', badge: 0 },
        { id: 'cart', icon: 'el-icon-shopping-cart-full', name: '购物车', route: '/cart', badge: 5 },
        { id: 'message', icon: 'el-icon-message', name: '消息', route: '/message', badge: 3 },
        { id: 'profile', icon: 'el-icon-user', name: '我的', route: '/profile', badge: 0 }
      ],
      currenBottomNavTag: 'home' // 当前选中的标签页
    }
  },
  methods: {
    handleSelect (route) {
      this.$router.push(route)
    }
  },
  props: {
    isSidebarOpen: Boolean,
    isSidebarDrawer: Boolean,
    isSidebarCollapsed: Boolean,
    isSmallScreen: Boolean
  },
  computed: {
    headerTitle () {
      return this.isSidebarCollapsed ? 'Del.' : 'Delicious.'
    },
    activeRoute () {
      return this.$route.path === '/' ? '/home' : this.$route.path
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

</style>
