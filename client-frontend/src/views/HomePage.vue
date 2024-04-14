
<template>
  <div>
    <div class="page-container">
      <div class="page-content">
        <div class="content-search-bar fixed-search" ref="search">
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
        <div class="content-dishes-list" v-if="isLoading">
          <ul class="product-list">
            <li class="skeleton-item" v-for="n in skeletonCount" :key="`skeleton-${n}`">
              <el-skeleton animated :throttle="500">
                <template slot="template">
                  <div class="skeleton-template">
                    <div class="skeleton-image">
                      <el-skeleton-item class="skeleton-img" variant="image"></el-skeleton-item>
                    </div>
                    <div class="item-detail">
                      <el-skeleton-item variant="text" ></el-skeleton-item>
                      <el-skeleton-item variant="text" ></el-skeleton-item>
                      <el-skeleton-item variant="text"></el-skeleton-item>
                    </div>
                  </div>
                </template>
              </el-skeleton>
            </li>
          </ul>
        </div>
        <div class="content-dishes-list" v-else>
          <ul class="product-list">
            <li  v-for="item in products" :key="item.id">
              <a class="product-item-link">
                <div class="product-item">
                  <div class="item-img">
                    <el-image class="image" :src="item.image" fit="cover" @load="() => item.imageLoaded = true"></el-image>
                  </div>
                  <div class="item-detail">
                    <p><strong>{{ item.storeName }}</strong></p>
                    <p><strong>{{ item.price }}</strong></p>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
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
        { name: 'category', value: 4 },
        { name: 'category', value: 5 },
        { name: 'category', value: 6 }
      ],
      products: [],
      MockProducts: [
        {
          id: 0,
          storeName: '脆皮鸡排',
          price: '￥45.00',
          image: 'https://via.placeholder.com/150?text=0',
          imageLoaded: true
        },
        {
          id: 1,
          storeName: '烤羊排',
          price: '￥60.00',
          image: 'https://via.placeholder.com/150?text=1',
          imageLoaded: true
        },
        {
          id: 2,
          storeName: '香辣鱿鱼',
          price: '￥20.00',
          image: 'https://via.placeholder.com/150?text=2',
          imageLoaded: true
        },
        {
          id: 3,
          storeName: '烤羊排',
          price: '￥51.00',
          image: 'https://via.placeholder.com/150?text=3',
          imageLoaded: true
        },
        {
          id: 4,
          storeName: '烤羊排',
          price: '￥97.00',
          image: 'https://via.placeholder.com/150?text=4',
          imageLoaded: true
        },
        {
          id: 5,
          storeName: '烤羊排',
          price: '￥97.00',
          image: 'https://via.placeholder.com/150?text=5',
          imageLoaded: true
        },
        {
          id: 6,
          storeName: '烤羊排',
          price: '￥97.00',
          image: 'https://via.placeholder.com/150?text=6',
          imageLoaded: true
        },
        {
          id: 7,
          storeName: '烤羊排',
          price: '￥97.00',
          image: 'https://via.placeholder.com/150?text=7',
          imageLoaded: true
        }
      ],
      isLoading: true, // 初始时数据正在加载
      skeletonCount: 5 // 假设初始加载显示5个骨架屏
    }
  },
  methods: {
    async fetchProducts () {
      // 模拟数据加载
      this.isLoading = true // 开始加载数据
      try {
        // const response = await fetchProductsFromAPI() // 假设的API请求方法
        // this.products = response.data
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        this.isLoading = false // 完成加载
      }
    },

    MockFetchProducts () {
      // 使用setTimeout来模拟数据的异步加载
      setTimeout(() => {
        this.products = this.MockProducts // 更新products数据
        this.isLoading = false // 数据加载完成，更新加载状态
      }, 2000) // 延迟2秒来模拟网络请求延迟
    },

    handleScroll () {
      window.requestAnimationFrame(() => {
        const searchOffset = this.$refs.search.getBoundingClientRect().top
        if (searchOffset <= 0 && !this.stickyActive) {
          this.stickyActive = true
          this.applyStickyStyles()
        } else if (searchOffset > 0 && this.stickyActive) {
          this.stickyActive = false
          this.resetStickyStyles()
        }
      })
    },
    applyStickyStyles () {
      this.$refs.search.style.backgroundColor = '#f8f9fa' // 更改背景色
      this.$refs.search.style.width = '90%' // 改变宽度
    },
    resetStickyStyles () {
      this.$refs.search.style.backgroundColor = 'white' // 重置背景色
      this.$refs.search.style.width = '100%' // 重置宽度
    }
  },
  mounted () {
    // this.fetchProducts() // 组件挂载后加载数据
    this.MockFetchProducts()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.page-container {
  height: 100%;
  padding-top: 0;

  .page-content {
    height: 100%;
    display: flex;
    row-gap: 0.5rem;
    flex-direction: column;
    padding:1rem 0;
    .fixed-search {
      position: sticky;
      top: 0; /* 调整这个值以适应可能存在的页面顶部边距或其他元素 */
      background-color: white; /* 确保搜索框背景不透明 */
      z-index: 1000; /* 提高层级确保它在其他内容上方 */
      transition: background-color 0.3s, width 0.3s; /* 平滑过渡效果 */
    }
    .content-search-bar {
      color: $orange;
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 0.4rem;
      min-height: 3.5rem;
      padding:1rem;
      background-color: white;

      .search-wrapper,
      .search-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3.5rem;
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
      padding:0 1rem;

      .category-wrapper {
        padding: 0 0.5rem;
        display: flex;
        column-gap: 0.8rem;
        align-items: center;
        height: 80%;
      }

      .category-item {
        cursor: pointer;
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
      padding:0 1rem;

      .product-list {
        display: flex;
        flex-direction: column;
        row-gap: 1.5rem;

        .skeleton-item {
          .skeleton-template {
            width: 100%;
            height: 10rem;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: start;
            @extend .box-shadow-2;
          }

          .skeleton-image {
            width: 10rem; /* 根据实际图片大小调整 */
            height: 100%; // 保持图片的高度与项目一致
            object-fit: cover; // 确保图片覆盖整个区域
            border-radius: 1rem 0 0 1rem; // 为图片添加圆角，仅左侧
            overflow: hidden;

            .skeleton-img {
              height: 100%;
              width: 100%;
            }
          }

          .item-detail {
            height: 100%;
            display: flex;
            row-gap: 1rem;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 1rem;
            flex: 1;
          }
        }

        .product-item{
          width: 100%;
          height: 10rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: row;
          justify-content: start;
          align-items: center;
          @extend .box-shadow-2;

          .item-img {
            width: 10rem;
            height: 100%; // 保持图片的高度与项目一致
            object-fit: cover; // 确保图片覆盖整个区域
            border-radius: 1rem 0 0 1rem; // 为图片添加圆角，仅左侧
            overflow: hidden;
            .image {
              height: 100%;
              width: 100%;
            }
          }
          .item-detail {
            flex: 1;
            padding-left: 1rem; // 给详情文本添加一些左边距

            p {
              margin: 0.5rem 0; // 给文本添加一些间距
            }
          }
        }
      }
    }
  }
}

</style>
