<template>
  <el-container class="home-page">
    <el-header class="page-header">
      <el-row class="header-wrapper" type="flex" justify="space-between" align="middle">
        <el-col class="header-menu" :span="4">
          <i class="el-icon-menu icon-button-1 big-icon-size"></i>
        </el-col>
        <el-col :span="16" class="header-title normal-title">Delicious.</el-col>
        <el-col :span="4" class="header-chat">
          <i class="el-icon-chat-line-round icon-button-1 big-icon-size"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="page-container">
      <div class="container-content">
        <div class="content-search-bar flex justify-center items-center">
          <div class="search-wrapper flex justify-center bg-or" style="align-items: center">
            <i class="el-icon-search icon-search big-icon-size"></i>
            <el-input class="custom-input" placeholder="搜索食物"></el-input>
          </div>
          <div class="search-filter flex justify-center items-center bg-or">
            <i class="el-icon-s-operation big-icon-size"></i>
          </div>
        </div>
        <div class="content-categories flex items-center">
          <div class="category-item" v-for="category in categories" :key="category.value">
            {{ category.name }}
          </div>
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
  name: 'HomePage',
  data () {
    return {
      categories: [
        { name: 'category', value: 1 },
        { name: 'category', value: 2 },
        { name: 'category', value: 3 },
        { name: 'category', value: 3 },
        { name: 'category', value: 3 },
        { name: 'category', value: 3 },
        { name: 'category', value: 3 },
        { name: 'category', value: 3 }
        // 更多分类...
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.home-page {
  background-color: $primary-color;
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
      row-gap: 1rem;
      flex-direction: column;

      .content-search-bar {
        color: $orange;

        column-gap: 0.8rem;
        height: 4rem;

        .search-wrapper, .search-filter {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .search-wrapper {
          flex: 1;
          padding: 0.5rem 1rem; /* 内边距调整 */

          .icon-search {
            color: $orange;
          }
        }

        .search-filter {
          width: 4rem; // 根据父容器的宽度设置宽度，这里的百分比可以根据需要调整

          &:hover {
            @extend .box-shadow;
          }
        }
      }

      .content-categories {
        height: 2.5rem;
        column-gap: 0.8rem;
        overflow-x: auto;
        //overflow: visible;
        white-space: nowrap;

        .category-item {
          height: 80%;
          color: $primary-color;
          font-family: 'Nunito-ExtraBold', 'Nunito', sans-serif;
          flex: none;
          display: inline-block;
          padding: 0.3rem 1.2rem;
          background-color: $green;
          //border: 1px solid #ccc;
          border-radius: 1rem;
          box-shadow: 0 1px 5px $green;
        }
      }

      /* 定制滚动条的轨道 */
      .content-categories::-webkit-scrollbar {
        height: 0; /* 控制滚动条高度 */
      }

      .content-dishes-list {

      }
    }
  }
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
