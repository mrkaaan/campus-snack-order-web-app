<template>
  <div :class="{ 'sidebar-active': isSidebarOpen, 'sidebar-active-collapsed': isSidebarCollapsed, 'sidebar-drawer':isMediumScreen, 'sidebar-active-drawer': isSidebarDrawer, 'sidebar-close': isSmallScreen}">
    <nav class="sidebar" v-if="!isMediumScreen">
      <Sidebar
        :isSidebarOpen="isSidebarOpen"
        :isSidebarDrawer="isSidebarDrawer"
        :isSidebarCollapsed="isSidebarCollapsed"
        :isSmallScreen="isSmallScreen"
      ></Sidebar>
    </nav>
    <el-drawer
      title="我是标题"
      :visible="isSidebarDrawer"
      @update:visible="handleDrawerVisibilityChange"
      direction="ltr"
      :with-header="false">
      <nav class="sidebar" style="width: 100%; position: static">
        <Sidebar
          :isSidebarOpen="isSidebarOpen"
          :isSidebarDrawer="isSidebarDrawer"
          :isSidebarCollapsed="isSidebarCollapsed"
          :isSmallScreen="isSmallScreen"
        ></Sidebar>
      </nav>
    </el-drawer>
    <main class="home-page content-shift">
      <page-header ref="header"></page-header>
      <router-view></router-view>
    </main>
    <CustomBottomNav></CustomBottomNav>
  </div>
</template>

<script>
import CustomBottomNav from '@/components/CustomBottomNav.vue' // 确保路径正确
import Sidebar from '@/components/Sidebar.vue' // 确保路径正确
import { mapState, mapActions, mapGetters } from 'vuex'
import PageHeader from '@/components/PageHeader.vue'
export default {
  name: 'MainLayout',
  data () {
    return {
    }
  },
  components: {
    PageHeader,
    CustomBottomNav,
    Sidebar
  },
  computed: {
    ...mapState('sidebar', [
      'isSidebarOpen',
      'isSidebarDrawer',
      'isSidebarCollapsed',
      'windowWidth'
    ]),
    ...mapGetters('sidebar', [
      'isWideScreen',
      'isMediumScreen',
      'isSmallScreen'
    ])
  },
  mounted () {
    // 组件挂载时设置初始侧边栏状态
    this.checkSidebarStatus()
    // 添加窗口尺寸变化监听器以更新屏幕状态
    window.addEventListener('resize', this.updateWindowSize)
    window.addEventListener('scroll', this.onScroll)
  },
  watch: {
    // 动态监听实现侧边栏默认状态
    windowWidth () {
      this.checkSidebarStatus()
    }
  },
  methods: {
    ...mapActions('sidebar', [
      'toggleSidebar',
      'updateWindowWidth',
      'checkSidebarStatus',
      'setSidebarDrawer'
    ]),
    ...mapActions('header', ['handleScroll']),
    onScroll () {
      if (this.$refs.header) {
        const currentScroll = window.pageYOffset
        // console.log(currentScroll)
        const headerHeight = this.$refs.header.getHeaderHeight()
        // console.log(headerHeight)
        this.handleScroll({
          currentScroll,
          headerHeight
        })
      }
    },
    handleDrawerVisibilityChange (newVisibility) {
      this.setSidebarDrawer(newVisibility)
    },
    updateWindowSize () {
      this.updateWindowWidth(window.innerWidth) // 使用 action
    }

  },
  beforeDestroy () {
    // 移除监听器以避免潜在的内存泄露
    window.removeEventListener('resize', this.updateWindowSize)
    window.addEventListener('scroll', this.onScroll)
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.home-page {
  background-color: $primary-color;
  height: 100%;
  padding-bottom: 0;
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

.container-cart {
  transition: transform 0.5s ease;

  .cart-icon{
    @extend .big-icon-size;
  }
}

.sidebar {
  position: fixed;
  top: 0;
  width: 0;
  height: 100%;
  background-color: #f0f0f0;
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

.content-shift {
  transition: all 0.3s ease; /* 平滑过渡效果 */
}
/* 宽屏模式 */
.sidebar-active {
  .sidebar {
    width: 15.625rem; /* 侧边栏宽度 */
  }
  .content-shift {
    margin-left: 15.625rem; /* 侧边栏打开时，主体内容向右移动 */
  }
}
/* 中屏模式 */
.sidebar-active-collapsed {
  .sidebar{
    width: 5rem;
  }
  .content-shift{
    margin-left: 5rem;
  }
}
/* 小屏模式 无侧边栏 开启底边栏 */
.sidebar-close {
  .bottom-nav {
    transform: translateY(0); /* 导航栏关闭时，向下移动隐藏 */
  }
  .home-page {
    padding-bottom: 5.625rem;
  }
  //.icon-sidebar {
    //opacity: 0;
  //}
}

/* 屏幕中等，缩小侧边栏 */
@media (max-width: 62rem) {
}

/* 屏幕最小，切换到底部导航栏 */
@media (max-width: 36rem) {
}

</style>

<style lang="scss">
@import '../styles/variables';

  .custom-input .el-input__inner {
    border: none !important;
    background-color: transparent !important;
  }

  .content-search-bar .el-input__inner::placeholder {
    color: $orange-light2 !important;
  }

</style>
