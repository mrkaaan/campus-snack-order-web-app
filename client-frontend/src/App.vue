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
    },
    async checkAuth () {
      try {
        await this.$store.dispatch('auth/initializeAuth')
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  },
  mounted () {
    // 添加窗口尺寸变化监听器以更新屏幕状态
    window.addEventListener('resize', this.updateWindowSize)
  },
  beforeDestroy () {
    // 移除监听器以避免潜在的内存泄露
    window.removeEventListener('resize', this.updateWindowSize)
  },
  created () {
    this.checkAuth()
    window.addEventListener('storage', () => {
      // 检测到 localStorage 变更，可以添加逻辑处理用户状态
      if (!localStorage.getItem('authUser')) {
        // 如果检测到 authUser 不再存在，可能需要更新应用状态或强制跳转到登录页面
        // 调用 store 的 initializeAuth
        this.checkAuth()
        // setTimeout(() => {
        //   this.$router.push('/initial')
        // }, 300)
      }
    })
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
