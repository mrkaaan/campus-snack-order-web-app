// store/modules/sidebar.js
export default {
  namespaced: true, // 启用命名空间
  state: {
    isSidebarOpen: true, // 初始状态，侧边栏默认打开
    isSidebarDrawer: false, // 抽屉模式
    isSidebarCollapsed: false, // 控制侧边栏是否为缩小模式
    windowWidth: window.innerWidth // 手动创建响应式页面宽度
  },
  mutations: {
    // 侧边栏按钮
    toggleSidebar (state) {
      if (state.windowWidth >= 992) {
        // 屏幕尺寸在宽屏时，切换侧边栏状态 展开 缩小
        state.isSidebarOpen = !state.isSidebarOpen
        state.isSidebarCollapsed = !state.isSidebarCollapsed
        state.isSidebarDrawer = false // 确保侧边栏不在抽屉状态
        console.log('宽屏模式 切换')
      } else if (state.windowWidth < 992 && state.windowWidth > 576) {
        // 屏幕尺寸在中等时，切换侧边栏状态 隐藏 抽屉
        state.isSidebarOpen = false // 确保侧边栏不在展开状态
        state.isSidebarDrawer = !state.isSidebarDrawer
        state.isSidebarCollapsed = false
        console.log('中屏模式 切换')
      } else if (state.windowWidth <= 576) {
        // 屏幕尺寸更小时，切换侧边栏开闭状态 隐藏
        state.isSidebarOpen = false
        state.isSidebarDrawer = false
        state.isSidebarCollapsed = false
        console.log('小屏模式 切换')
      }
    },
    updateWindowWidth (state, width) {
      state.windowWidth = width
    },
    // 根据当前windowWidth设置侧边栏状态
    checkSidebarStatus (state) {
      if (state.windowWidth >= 992) {
        state.isSidebarOpen = true
        state.isSidebarDrawer = false
        state.isSidebarCollapsed = false
      } else if (state.windowWidth <= 992 && state.windowWidth > 576) {
        state.isSidebarOpen = false
        state.isSidebarDrawer = false
        state.isSidebarCollapsed = false
      } else if (state.windowWidth <= 576) {
        state.isSidebarOpen = false
        state.isSidebarDrawer = false
        state.isSidebarCollapsed = false
      }
    },
    SET_SIDEBAR_DRAWER (state, payload) {
      state.isSidebarDrawer = payload
    }
  },
  actions: {
    toggleSidebar ({ commit }) {
      commit('toggleSidebar')
    },
    updateWindowWidth ({ commit }, width) {
      commit('updateWindowWidth', width)
    },
    checkSidebarStatus ({ commit }) {
      commit('checkSidebarStatus')
    },
    setSidebarDrawer ({ commit }, payload) {
      commit('SET_SIDEBAR_DRAWER', payload)
    }
  },
  getters: {
    isWideScreen: state => state.windowWidth >= 992,
    isMediumScreen: state => state.windowWidth < 992 && state.windowWidth > 576,
    isSmallScreen: state => state.windowWidth <= 576
  }
}
