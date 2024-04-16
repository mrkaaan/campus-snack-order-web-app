
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
                    <p class="detail-title"><strong>{{ item.storeName }}</strong></p>
                    <div class="item-wrapper">
                      <div class="detail-column column-left">
                        <div class="detail-row">
                          <div class="detail-rating">
                            <el-rate v-model="item.rating" disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']"/>
                            <p class="detail-text detail-rating">{{ item.rating.toFixed(1) }}分</p>
                          </div>
                        </div>
                        <div class="detail-row">
                          <p class="detail-text detail-price">人均 ￥{{ item.priceRange[0] }}-{{ item.priceRange[1] }}</p>
                        </div>
                        <div class="detail-row">
                          <div class="detail-dish-list">
                            <div class="detail-dish" v-for="(dish, index) in item.mainDish" :key="`dish-${index}-${dish}`">
                              <p class="detail-text">{{ dish }}</p>
                              <span v-if="index < item.mainDish.length - 1" class="separator">|</span>
                            </div>
                          </div>
                        </div>
                        <div class="detail-row">
                          <div class="detail-tag">
                            <i class="el-icon-dish"></i>
                            <p class="detail-text">{{ item.operatingHours }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="detail-column column-right">
                        <div class="detail-row">
                          <div class="detail-local">
                            <i class="el-icon-location-outline"></i>
                            <p class="detail-text">{{ item.locationDescription }}</p>
                          </div>
                        </div>
                        <div class="detail-row">
                          <p class="detail-text">月售{{ item.monthlySales }}+</p>
                        </div>
                      </div>
                    </div>
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
import { mapGetters } from 'vuex'
import { EventBus } from '@/eventBus'

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
          id: 1,
          storeName: '李大夫小吃',
          image: 'https://via.placeholder.com/150?text=1',
          priceRange: [10, 20],
          mainDish: ['煎饼果子'],
          operatingHours: '09:00-17:00',
          locationDescription: '图书馆旁边',
          rating: 4.5,
          monthlySales: 120
        },
        {
          id: 2,
          storeName: '张姐快餐',
          image: 'https://via.placeholder.com/150?text=2',
          priceRange: [15, 25],
          mainDish: ['盖浇饭', '小炒肉'],
          operatingHours: '10:00-20:00',
          locationDescription: '体育馆对面',
          rating: 4.0,
          monthlySales: 95
        },
        {
          id: 3,
          storeName: '周师傅面馆',
          image: 'https://via.placeholder.com/150?text=3',
          priceRange: [12, 30],
          mainDish: ['拉面', '牛肉面', '鸡蛋面'],
          operatingHours: '08:00-18:00',
          locationDescription: '学生活动中心旁',
          rating: 4.2,
          monthlySales: 150
        },
        {
          id: 4,
          storeName: '老李水果店',
          image: 'https://via.placeholder.com/150?text=4',
          priceRange: [5, 15],
          mainDish: ['新鲜水果', '果汁'],
          operatingHours: '08:00-22:00',
          locationDescription: '北门外',
          rating: 3.8,
          monthlySales: 80
        },
        {
          id: 5,
          storeName: '黄阿姨早餐',
          image: 'https://via.placeholder.com/150?text=5',
          priceRange: [3, 10],
          mainDish: ['豆浆油条', '煎饼'],
          operatingHours: '05:00-11:00',
          locationDescription: '东门内',
          rating: 4.5,
          monthlySales: 200
        },
        {
          id: 6,
          storeName: '刘师傅烧烤',
          image: 'https://via.placeholder.com/150?text=6',
          priceRange: [20, 50],
          mainDish: ['烧烤', '烤鱼', '羊肉串'],
          operatingHours: '18:00-24:00',
          locationDescription: '南门外',
          rating: 4.3,
          monthlySales: 180
        },
        {
          id: 7,
          storeName: '香辣虾大王',
          image: 'https://via.placeholder.com/150?text=7',
          priceRange: [25, 45],
          mainDish: ['香辣虾'],
          operatingHours: '10:00-22:00',
          locationDescription: '西门外',
          rating: 3.9,
          monthlySales: 140
        },
        {
          id: 8,
          storeName: '清心茶铺',
          image: 'https://via.placeholder.com/150?text=8',
          priceRange: [8, 20],
          mainDish: ['各式茶饮', '点心'],
          operatingHours: '10:00-21:00',
          locationDescription: '图书馆对面',
          rating: 4.1,
          monthlySales: 110
        },
        {
          id: 9,
          storeName: '甜心蛋糕坊',
          image: 'https://via.placeholder.com/150?text=9',
          priceRange: [15, 50],
          mainDish: ['蛋糕', '甜点', '咖啡'],
          operatingHours: '09:00-19:00',
          locationDescription: '艺术学院旁',
          rating: 4.7,
          monthlySales: 160
        },
        {
          id: 10,
          storeName: '韩式料理屋',
          image: 'https://via.placeholder.com/150?text=10',
          priceRange: [18, 40],
          mainDish: ['韩国料理', '泡菜', '烤肉'],
          operatingHours: '11:00-21:00',
          locationDescription: '国际学生宿舍旁',
          rating: 4.4,
          monthlySales: 190
        }
      ],
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
      console.log(paddingLeft)
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
    this.MockFetchProducts()
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

    .content-dishes-list {
      cursor:pointer;
      padding:0 1rem;

      .product-list {
        display: flex;
        flex-direction: column;
        row-gap: 1.5rem;
        a,
        a:hover,
        a:focus,
        a:active {
          text-decoration: none !important;
        }
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
            height: 100%;
            width: 100%;
            padding: 0.5rem 1rem; // 给详情文本添加一些左边距
            display: flex;
            flex-direction: column;
            gap: 0.1rem;

            .detail-title {
              display: flex;
              justify-content: start;
              font-size: 110%;
            }

            .item-wrapper{
              display: flex; /* 设置为表格布局 */
              flex-direction: row;
              width: 100%;
              height: 100%;
              font-size: 85%;
              overflow: hidden; /* 防止文本溢出 */
              text-overflow: ellipsis;
              white-space: nowrap; /* 可以移除这个，如果你想让文本换行 */
              color: #666666;

              .detail-column {
                height: 100%;
                display: flex;
                flex-direction: column;
                //gap:0.5rem;
                //justify-content: space-between;
              }
              .column-left {
                flex: 8 0 auto;
                align-items: start;
                gap: 0.5rem;
              }
              .column-right {
                flex: 1 0 auto;
                align-items: end;
              }
              .detail-row {
                display: flex;
                flex-direction: row;
                gap:1rem;
              }
              .detail-tag {
                @extend .tag-1;
              }
              .detail-rating {
                color: $orange;
              }
              .detail-price {
                color: $orange;
              }
              .detail-local {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap:0.2rem;
              }
              .detail-rating {
                display: flex;
                flex-direction: row;
                align-items: center;
                //gap:0.2rem;
              }
              .detail-dish-list {
                @extend .tag-2;
                .detail-dish {
                  display: flex;
                  gap:0.2rem;
                  flex-direction: row;
                  //align-items: center;
                }
              }
              .separator {
              }
            }

          }
        }
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
