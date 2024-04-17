
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
        <div class="content-wrapper" v-if="isLoading">
          <ul class="merchant-list">
            <merchant-skeleton-item  v-for="n in skeletonCount" :key="`skeleton-${n}`"></merchant-skeleton-item>
          </ul>
        </div>
        <div class="content-wrapper" v-else>
          <ul class="merchant-list">
            <merchant-item v-for="item in products" :key="item.id" :item="item">
            </merchant-item>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/eventBus'
import MerchantItem from '@/components/MerchantItem.vue'
import MerchantSkeletonItem from '@/components/MerchantSkeletonItem.vue'
import { getMerchants } from '@/api/merchant'

export default {
  name: 'HomePage',
  components: { MerchantSkeletonItem, MerchantItem },
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
      isLoading: true, // 初始时数据正在加载
      skeletonCount: 5, // 假设初始加载显示5个骨架屏
      stickyActive: false,
      lastCall: 0,
      throttlePeriod: 100, // 节流时间间隔（毫秒）
      headerHeight: 0
    }
  },
  created () {
    EventBus.$on('headerHeightChanged', (height) => {
      this.headerHeight = height
    })
  },
  methods: {
    async fetchMerchants () {
      // 模拟数据加载
      this.isLoading = true // 开始加载数据
      try {
        const response = await getMerchants() // 假设的API请求方法
        this.products = response.data
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        this.isLoading = false // 完成加载
      }
    },

    // MockFetchProducts () {
    //   // 使用setTimeout来模拟数据的异步加载
    //   setTimeout(() => {
    //     this.products = this.MockProducts // 更新products数据
    //     this.isLoading = false // 数据加载完成，更新加载状态
    //   }, 2000) // 延迟2秒来模拟网络请求延迟
    // },

    handleScroll () {
      // const now = Date.now()
      // if (now - this.lastCall < this.throttlePeriod) return
      // this.lastCall = now

      const currentScroll = window.pageYOffset
      const headerHeight = this.$refs.header ? this.$refs.header.getHeaderHeight() : 0
      window.requestAnimationFrame(() => {
        this.updatePaddingLeft(currentScroll, headerHeight)
      })
    },
    updatePaddingLeft (currentScroll, headerHeight) {
      const scrollStart = 0 // 滚动起点
      const scrollEnd = this.headerHeight / 2 // 根据需要调整，滚动结束点
      let paddingLeft = this.isSmallScreen ? 0 : 15

      if (currentScroll > scrollStart && currentScroll < scrollEnd) {
        const progress = (currentScroll - scrollStart) / (scrollEnd - scrollStart)
        paddingLeft = Math.min(50, progress * 50) // 最大paddingLeft为3.13rem
      } else if (currentScroll >= scrollEnd) {
        paddingLeft = 50
      }
      // console.log(paddingLeft)
      if (!this.isSmallScreen) {
        this.$refs.search.style.paddingLeft = `${paddingLeft}px`
      }
    },
    resetStickyStyles () {
      this.$refs.search.style.paddingLeft = '0.00rem' // 重置左内边距
    }
  },
  computed: {
    ...mapGetters('sidebar', ['isSmallScreen'])
  },
  mounted () {
    // this.fetchProducts() // 组件挂载后加载数据
    this.fetchMerchants()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
    EventBus.$off('headerHeightChanged')
  },
  watch: {
    // 监听 isSmallScreen 的变化
    isSmallScreen (newValue) {
      if (newValue) {
        this.$refs.search.style.paddingLeft = '0.94rem'
      }
    }
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
    //padding:1rem 0;
    .fixed-search {
      position: sticky;
      top: 0; /* 调整这个值以适应可能存在的页面顶部边距或其他元素 */
      background-color: white; /* 确保搜索框背景不透明 */
      z-index: 1000; /* 提高层级确保它在其他内容上方 */
      transition: padding-left 0.3s; /* 平滑过渡效果 */
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

    .content-wrapper {
      cursor:pointer;
      padding:0 1rem;

      .merchant-list {
        display: flex;
        flex-direction: column;
        row-gap: 1.5rem;

      }
    }
  }
}
</style>

<style>
.detail-rating {
  .el-rate {
    height: auto;
    line-height: normal;
  }
  .el-rate__icon {
    margin-right: 0;
  }
}
</style>
