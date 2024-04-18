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

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'PageHeader',
  mounted () {
    this.updateDimensions()
    // console.log('header', this.$refs.headerContent.clientHeight)
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
    },
    ...mapState('header', ['currentScroll', 'lastScroll', 'headerHeight']),
    headerStyle () {
      const style = {
        top: '0px'
        // opacity: '1'
      }
      if (this.currentScroll > this.lastScroll && this.currentScroll > this.headerHeight) {
        // style.top = `-${this.headerHeight}px`
        style.top = '0'

        // style.opacity = '0'
      } else if (this.currentScroll < this.lastScroll) {
        style.top = '0'
        // style.opacity = '1'
      }
      console.log('style.top', style.top)
      return style
    }
  },
  methods: {
    ...mapActions('sidebar', [
      'toggleSidebar'
    ]),
    ...mapActions('header', ['updateHeaderHeight', 'updateHeaderTop']),
    updateDimensions () {
      const header = this.$refs.headerContent
      if (header) {
        this.updateHeaderHeight(header.clientHeight)
        this.updateHeaderTop(header.getBoundingClientRect().top)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.page-header {
  background-color: $primary-color;

  .header-title {
    height: 3.5rem;
    line-height: 3.5rem;
  }

  .header-wrapper {
    padding: 0.5rem 1rem;
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
