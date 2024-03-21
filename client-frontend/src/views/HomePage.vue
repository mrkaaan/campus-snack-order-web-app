<template>
  <el-container class="home-page">
    <el-header class="page-header">
      <el-row class="header-wrapper" type="flex" justify="center" align="middle">
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
      <div class="page-content">
        <div class="content-search-bar">
          <div class="search-wrapper">
            <i class="el-icon-search icon-search"></i>
            <el-input class="custom-input" placeholder="搜索食物"></el-input>
          </div>
          <div class="search-filter">
            <i class="el-icon-s-operation big-icon-size"></i>
          </div>
        </div>
        <div class="content-categories">
          <div class="category-wrapper">
            <div class="category-item" v-for="category in categories" :key="category.value">
              {{ category.name }}
            </div>
          </div>
        </div>
        <div class="content-dishes-list">
          <ul class="product-list">
            <li v-for="item in products" :key="item">
              <a class="product-item-link">
                <div class="product-item">
                  <div class="item-img">img</div>
                  <div class="item-detail">detail</div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </el-main>
    <CartFloating class="container-cart">
      <i class="el-icon-shopping-cart-2 cart-icon"></i>
    </CartFloating>
  </el-container>
</template>

<script>
import CartFloating from '@/components/CartFloating.vue'
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
      ],
      products: 10
    }
  },
  components: {
    CartFloating
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
      .header-menu, .header-chat {
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
    padding-top: 0;

    .page-content{
      height: 100%;
      display: flex;
      row-gap: 0.5rem;
      flex-direction: column;

      .content-search-bar {
        color: $orange;
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.4rem;
        min-height: 3.5rem;

        .search-wrapper, .search-filter {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          @extend .bg-or;
        }
        .search-wrapper {
          flex: 1;
          padding: 0 1rem;

          .icon-search {
            color: $orange;
            @extend .big-icon-size;
          }
        }
        .search-filter {
          align-items: center;
          width: 3.5rem;
          &:hover {
            @extend .box-shadow;
          }
        }
      }

      .content-categories {
        display: flex;
        align-items: center;
        min-height: 3.5rem;
        overflow-x: auto;
        white-space: nowrap;

        .category-wrapper {
          padding: 0 0.5rem;
          display: flex;
          column-gap: 0.8rem;
          align-items: center;
          height: 80%;
        }

        .category-item {
          height: 80%;
          color: $primary-color;
          font-family: 'Nunito-ExtraBold', 'Nunito', sans-serif;
          flex: none;
          display: inline-block;
          padding: 0.3rem 1.2rem;
          background-color: $green;
          border-radius: 1rem;
          @extend .box-shadow-green;
        }
      }

      /* 控制滚动条高度 */
      .content-categories::-webkit-scrollbar {
        height: 0;
      }

      .content-dishes-list {

        .product-list {
          display: flex;
          flex-direction: column;
          row-gap: 1.5rem;

          .product-item{
            width: 100%;
            height: 10rem;
            border-radius: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            @extend .box-shadow-2;

            .item-img {
              width: 10rem;
            }
            .item-detail {
              flex: 1
            }
          }
        }
      }
    }
  }

  .container-cart {
    transition: transform 0.5s ease;

    .cart-icon{
      @extend .big-icon-size;
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
