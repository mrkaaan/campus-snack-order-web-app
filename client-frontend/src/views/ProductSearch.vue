
<template>
  <div>
    <div class="page-container" :style="isSmallScreen ? {paddingBottom: '6rem'} : {paddingBottom: '0'}">
      <div class="page-content">
        <div class="content-search-bar fixed-search" :style="{paddingLeft: paddingLeft + 'rem'}">
          <div class="search-wrapper" style="color: black">
            <i class="el-icon-search icon-search" style="cursor: default"></i>
            <el-input class="custom-input" placeholder="搜索食物" v-model="searchKey" @keydown.enter="handleSearchProduct"></el-input>
          </div>
          <div class="search-filter" style="font-weight: bold; font-size: 1.2rem; cursor: pointer" @click="handleSearchProduct">
            <span>搜索</span>
            <!--            <i class="el-icon-s-operation big-icon-size"></i>-->
          </div>
        </div>
        <div class="content-categories">
          <div class="category-wrapper">
            <div class="category-item" v-for="(category, index) in categories" :key="`category-${index}`" style="cursor: pointer;" @click="handleSearchProduct(category)">
              {{ category }}
            </div>
          </div>
        </div>
        <!-- 加载状态 -->
        <div v-if="isLoading" v-loading="isLoading">
          <div class="content-wrapper">
            <ul class="merchant-list">
              <el-empty description='加载中'></el-empty>
            </ul>
          </div>
        </div>

        <div v-else>
          <div v-if="merchants.length > 0" class="content-wrapper">
            <ul class="merchant-list">
              <li v-for="item in merchants" :key="item.id" @click="goToMerchantDetails(item)">
                <merchant-item-expand :item="item"></merchant-item-expand>
              </li>
            </ul>
          </div>

          <!-- 如果 merchants 为空，显示 el-empty -->
          <el-empty v-else description='请搜索商品'></el-empty>
        </div>
      </div>
    </div>
  </div>
<!--  </div>-->
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import MerchantItemExpand from '@/components/MerchantItemExpand.vue'
import { searchMerchants } from '@/api/search'

export default {
  name: 'ProductSearch',
  components: { MerchantItemExpand },
  data () {
    return {
      searchKey: '',
      categories: ['快餐', '甜点', '饮料', '传统美食', '海鲜', '烧烤', '火锅', '素食', '小吃', '早餐'],
      merchants: [],
      isLoading: false, // 初始时数据正在加载
      allDataLoaded: false, // 避免重复加载
      skeletonCount: 5, // 假设初始加载显示5个骨架屏
      stickyActive: false
    }
  },
  methods: {
    ...mapActions('merchant', ['updateMerchantDetails']),
    async handleSearchProduct (text = null) {
      this.isLoading = true // 开始加载数据
      this.searchKey = text || this.searchKey
      try {
        const response = await searchMerchants({ keyword: this.searchKey })
        setTimeout(() => {
          this.merchants = response.data
          this.isLoading = false // 请求成功后停止加载
        }, 500)
      } catch (error) {
        console.error('Failed to search products:', error)
      }
    },
    goToMerchantDetails (merchantDetails) {
      this.updateMerchantDetails(merchantDetails)
      // console.log('merchant', merchantDetails.merchantId)
      this.$router.push({ name: 'merchantDetails', params: { merchantId: merchantDetails.merchantId } })
    }
  },
  computed: {
    ...mapGetters('sidebar', ['isSmallScreen']),
    ...mapState('header', ['headerHeight', 'currentScroll']),
    paddingLeft () {
      // 默认值设置为最小值0.94
      let paddingLeft = 0.94

      // console.log('currentScroll', this.currentScroll)
      // console.log('headerHeight', this.headerHeight)

      if (!this.isSmallScreen) {
        if (this.currentScroll >= 0 && this.currentScroll <= this.headerHeight) {
          // 计算 currentScroll 占 headerHeight 的比例
          const ratio = this.currentScroll / this.headerHeight

          // 使用线性插值计算 paddingLeft
          // 初始值0.94，最大值3，线性增长
          paddingLeft = 0.94 + (3 - 0.94) * ratio
        } else if (this.currentScroll > this.headerHeight) {
          // 如果滚动超过 headerHeight，固定 paddingLeft 为最大值3
          paddingLeft = 3
        }
      }

      // console.log('paddingLeft', paddingLeft)
      return paddingLeft
    }
  },
  created () {
    this.searchKey = this.$route.query.keyword || ''
    this.handleSearchProduct()
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
    .fixed-search {
      position: sticky;
      top: 0;
      background-color: $primary-color;
      z-index: 1000;
      transition: padding-left 0.3s;
    }
    .content-search-bar {
      color: $orange;
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 0.4rem;
      min-height: 3.5rem;
      padding:0.5rem 1rem;
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
.el-loading-spinner {
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>
