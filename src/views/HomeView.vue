<template>
  <el-container class="home-container">
    <el-aside width="200px" class="home-aside">
      <div class="aside-top">Logo</div>
      <el-menu class="aside-bottom" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item v-for="i in 5" :index="i" :key="i">
          <div class="aside-menu-item">
            <i class="el-icon-setting"></i>
            <span slot="title">导航{{ i }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container class="home-content">
      <el-header class="home-header">Header</el-header>
      <el-main class="home-main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
  }
}
</script>

<style lang="scss" scoped>
.home-container{
  height: 100%;

  .home-aside {
    background-color: $primary-color;
    border-right: 1px solid $border-color;

    .aside-bottom{
      overflow: hidden;
    }
  }

  .home-header {
    background-color: $primary-color
  }

  .home-main {
    background-color: $secondary-color
  }
}

</style>
