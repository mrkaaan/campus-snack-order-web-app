<template>
  <el-container class="home-page">
    <el-header class="page-header">
      <el-row class="header-wrapper" type="flex" justify="space-between" align="middle">
        <el-col class="header-menu " :span="4">
          <i class="el-icon-menu"></i>
        </el-col>
        <el-col :span="16" class="header-title">点餐</el-col>
        <el-col :span="4" class="header-chat">
          <i class="el-icon-chat-line-round"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="page-container">
      <div class="container-content">
        <div class="content-search-bar">
          <div class="search-wrapper">
            <i class="el-icon-search"></i>
            <el-input class="" placeholder="搜索食物"></el-input>
          </div>
          <div class="search-filter">
            <i class="el-icon-s-operation"></i>
          </div>
        </div>
        <div class="content-categories">
        </div>
        <div class="content-dishes-list">
        </div>
      </div>
      <div class="container-floating-cart">
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped lang="scss">
  .home-page {
    background-color: #ffffff;
    height: 100%;

    .page-header {
      .header-wrapper {
        height: 100%;

        .header-menu, .header-menu, .header-chat {
          height: 100%;
          display: flex;
          align-items: center;
        }
        .header-menu {
          justify-content: left;
        }
        .header-chat {
          justify-content: right;
        }
      }
    }

    .page-container {
      height: 100%;

      .container-content {
        height: 100%;
        display: flex;
        flex-direction: column;

        .content-search-bar {
          @apply flex justify-center;
        }
        .content-categories {

        }
        .content-dishes-list {

        }

      }
    }
  }
</style>
