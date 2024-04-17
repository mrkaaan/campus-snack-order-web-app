<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { EventBus } from '@/eventBus'

export default {
  name: 'PageHeader',
  mounted () {
    // console.log(this.$refs.headerContent.clientHeight)
    this.broadcastHeight()
  },
  computed: {
    ...mapGetters('sidebar', [
      'isSmallScreen'
    ]),
    sidebarIconStyle () {
      // 根据 isSmallScreen 返回不同的样式对象
      return {
        opacity: this.isSmallScreen ? '0' : '1'
      }
      // return {
      //   opacity: '1'
      // }
    },
    ...mapState('header', ['currentScroll', 'lastScroll', 'headerHeight']),
    headerStyle () {
      const style = {
        top: '0px'
        // opacity: '1'
        // position: 'fixed'
      }
      if (this.currentScroll > this.lastScroll && this.currentScroll > this.headerHeight) {
        style.top = `-${this.headerHeight}px`
        // style.opacity = '0'
      } else if (this.currentScroll < this.lastScroll) {
        style.top = '0'
        // style.opacity = '1'
      }
      return style
    }
  },
  methods: {
    ...mapActions('sidebar', [
      'toggleSidebar'
    ]),
    getHeaderHeight () {
      // console.log('被调用')
      return this.$refs.headerContent ? this.$refs.headerContent.clientHeight : 0
    },
    broadcastHeight () {
      const height = this.getHeaderHeight()
      // console.log(height)
      EventBus.$emit('headerHeightChanged', height)
    }
  }
}
</script>

<template>
  <div class="page-header" :style="headerStyle" ref="headerContent">
    <el-row class="header-wrapper" type="flex" justify="center" align="middle">
      <el-col class="header-menu" :span="4">
        <i class="el-icon-menu icon-button-1 big-icon-size icon-sidebar" @click="toggleSidebar" :style="sidebarIconStyle"></i>
      </el-col>
      <el-col :span="16" class="header-title normal-title"><h2>Delicious.</h2></el-col>
      <el-col :span="4" class="header-chat">
        <i class="el-icon-chat-line-round icon-button-1 big-icon-size"></i>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
@import '../styles/multi';

.page-header {
  background-color: $primary-color;
  .header-wrapper {
    padding: 1rem;
    height: 100%;
    .header-menu, .header-chat {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .header-menu {
      justify-content: left;
      .icon-sidebar {
        transition: opacity 0.2s ease;
        opacity: 1;
        position: fixed;
        z-index: 1001;
      }
    }
    .header-chat {
      justify-content: right;
    }
  }
}

.sidebar-close {
  .icon-sidebar {
    //opacity: 0;
  }
}
</style>
