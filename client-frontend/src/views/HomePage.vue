<template>
  <div :class="{ 'sidebar-active': isSidebarOpen, 'sidebar-active-collapsed': isSidebarCollapsed, 'sidebar-active-drawer': isSidebarDrawer}">
    <nav class="sidebar">
      <!-- 侧边栏内容 -->
    </nav>
    <el-drawer
      title="我是标题"
      :visible.sync="isSidebarDrawer"
      direction="ltr"
      :with-header="false">
      <span>我来啦!</span>
    </el-drawer>
    <main class="home-page content-shift">
      <div class="page-header">
        <el-row class="header-wrapper" type="flex" justify="center" align="middle">
          <el-col class="header-menu" :span="4">
            <i class="el-icon-menu icon-button-1 big-icon-size" @click="toggleSidebar"></i>
          </el-col>
          <el-col :span="16" class="header-title normal-title">Delicious.</el-col>
          <el-col :span="4" class="header-chat">
            <i class="el-icon-chat-line-round icon-button-1 big-icon-size"></i>
          </el-col>
        </el-row>
      </div>
      <div class="page-container">
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
    </main>
    <footer class="bottom-nav">
    </footer>
    <CartFloating class="container-cart">
      <i class="el-icon-shopping-cart-2 cart-icon"></i>
    </CartFloating>
  </div>
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
        }
      ],
      isLoading: true, // 初始时数据正在加载
      skeletonCount: 5, // 假设初始加载显示5个骨架屏
      windowWidth: window.innerWidth, // 手动创建响应式页面宽度
      isSidebarOpen: true, // 初始状态，侧边栏默认打开
      isSidebarDrawer: false, // 抽屉模式
      isSidebarCollapsed: false // 控制侧边栏是否为缩小模式
    }
  },
  components: {
    CartFloating
  },
  computed: {
    isWideScreen () {
      console.log('宽屏模式')
      return this.windowWidth > 992
    },
    // 计算属性用于判断是否是中等屏幕尺寸
    isMediumScreen () {
      console.log('中屏模式')
      return this.windowWidth <= 992 && this.windowWidth > 576
    },
    // 计算属性用于判断是否是小屏幕尺寸
    isSmallScreen () {
      console.log('小屏模式')
      return this.windowWidth <= 576
    }
  },
  mounted () {
    // this.fetchProducts() // 组件挂载后加载数据
    this.MockFetchProducts()
    this.checkSidebarStatus() // 组件挂载时设置初始侧边栏状态
    // 添加窗口尺寸变化监听器以更新屏幕状态
    window.addEventListener('resize', () => {
      this.handleResize() // 强制Vue重新渲染以应用新的屏幕尺寸状态
    })
  },
  watch: {
    // 动态监听实现侧边栏默认状态
    windowWidth () {
      this.checkSidebarStatus()
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
    // 更新窗口宽度
    handleResize () {
      this.windowWidth = window.innerWidth
    },
    // 侧边栏按钮
    toggleSidebar () {
      if (this.isWideScreen) {
        // 屏幕尺寸在宽屏时，切换侧边栏状态 展开 缩小
        this.isSidebarOpen = !this.isSidebarOpen
        this.isSidebarCollapsed = !this.isSidebarCollapsed
        this.isSidebarDrawer = false // 确保侧边栏不在抽屉状态
        console.log('宽屏模式 切换')
      } else if (this.isMediumScreen) {
        // 屏幕尺寸在中等时，切换侧边栏状态 隐藏 抽屉
        this.isSidebarOpen = false // 确保侧边栏不在展开状态
        this.isSidebarDrawer = !this.isSidebarDrawer
        this.isSidebarCollapsed = false
        console.log('中屏模式 切换')
      } else if (this.isSmallScreen) {
        // 屏幕尺寸更小时，切换侧边栏开闭状态 隐藏
        this.isSidebarOpen = false
        this.isSidebarDrawer = false
        this.isSidebarCollapsed = false
        console.log('小屏模式 切换')
      }
    },
    // 根据当前windowWidth设置侧边栏状态
    checkSidebarStatus () {
      if (this.windowWidth >= 992) {
        this.isSidebarOpen = true
        this.isSidebarDrawer = false
        this.isSidebarCollapsed = false
      } else if (this.windowWidth <= 992 && this.windowWidth > 576) {
        this.isSidebarOpen = false
        this.isSidebarDrawer = false
        this.isSidebarCollapsed = false
      } else if (this.windowWidth <= 576) {
        this.isSidebarOpen = false
        this.isSidebarDrawer = false
        this.isSidebarCollapsed = false
      }
    }
  },
  beforeDestroy () {
    // 移除监听器以避免潜在的内存泄露
    window.removeEventListener('resize', () => {
      this.handleResize()
    })
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.home-page {
  background-color: $primary-color;
  height: 100%;

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
      padding:1rem;

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

  .container-cart {
    transition: transform 0.5s ease;

    .cart-icon{
      @extend .big-icon-size;
    }
  }
}

.sidebar {
  position: fixed;
  top: 0;
  width: 0;
  height: 100%;
  background-color: #f0f0f0;
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

.content-shift {
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

/* 宽屏模式 */
.sidebar-active {
  .sidebar {
    width: 250px; /* 侧边栏宽度 */
  }
  .content-shift {
    margin-left: 250px; /* 侧边栏打开时，主体内容向右移动 */
  }
}

/* 缩小模式 */
.sidebar-active-collapsed {
  .sidebar{
    width: 80px;
  }
  .content-shift{
    margin-left: 80px;
  }
}

/* 屏幕中等，缩小侧边栏 */
@media (max-width: 992px) {
  .sidebar {
    //width: 80px;
  }
  .content-shift {
    //margin-left: 80px;
  }
}

/* 屏幕最小，切换到底部导航栏 */
@media (max-width: 576px) {
  .sidebar{
    //width: 0;
  }
  .sidebar-active .content-shift {
    //margin-left: 0;
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
