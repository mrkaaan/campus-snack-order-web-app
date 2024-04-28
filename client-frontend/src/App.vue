<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import MainLayout from '@/views/MainLayout.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  // components: { MainLayout }
  methods: {
    ...mapActions('sidebar', [
      'updateWindowWidth'
    ]),
    updateWindowSize () {
      this.updateWindowWidth(window.innerWidth) // 使用 action
    }
  },
  mounted () {
    // 添加窗口尺寸变化监听器以更新屏幕状态
    window.addEventListener('resize', this.updateWindowSize)
  },
  beforeDestroy () {
    // 移除监听器以避免潜在的内存泄露
    window.removeEventListener('resize', this.updateWindowSize)
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
