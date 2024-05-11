<template>
  <div class="search">
    <div class="search-wrapper" :style="searchWrapper">
      <el-form :model="searchForm" @submit.native.prevent="searchOrders">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户ID">
              <el-input v-model="searchForm.accountId" placeholder="输入用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="订单ID">
              <el-input v-model="searchForm.orderId" placeholder="输入订单ID 支持模糊搜索"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商品/套餐ID">
              <el-input v-model="searchForm.productId" placeholder="输入商品/套餐ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商品类型">
              <el-select v-model="searchForm.type" placeholder="选择商品类型" style="display: block;">
                <el-option label="商品" value="product"></el-option>
                <el-option label="套餐" value="bundle"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="12"  style="display: flex">
            <el-form-item label="订单价格范围">
            </el-form-item>
            <el-slider
              style="flex:1; padding:0 1rem 0 0"
              v-model="searchForm.priceRange"
              range
              :min="0"
              :max="1000"
              :step="10"
            ></el-slider>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="6">
            <el-form-item>
              <el-button class="btn" type="primary" @click="handelSearchOrders">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="orders" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderId" label="订单ID"></el-table-column>
        <el-table-column prop="orderTime" label="订单时间"></el-table-column>
        <el-table-column prop="pickupNumber" label="当日流水号">
          <template slot-scope="scope">
            {{ scope.row.pickupNumber.toString().padStart(3, '0') }}
          </template>
        </el-table-column>
        <el-table-column prop="merchantId" label="商家ID"></el-table-column>
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="originalPrice" label="总原价"></el-table-column>
        <el-table-column prop="discount" label="折扣"></el-table-column>
        <el-table-column prop="salePrice" label="总价"></el-table-column>
        <el-table-column prop="payStatus" label="订单状态">
          <template slot-scope="scope">
            {{ mapOrderPayStatus(scope.row.payStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="mealStatus" label="餐品状态">
          <template slot-scope="scope">
            {{ mapOrderMealStatus(scope.row.mealStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="showDetails(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="detailsVisible" title="订单详情">
        <el-table :data="selectedOrderDetails" style="width: 100%">
          <el-table-column prop="productName" label="商品名"></el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <el-table-column prop="salePrice" label="销售价格"></el-table-column>
          <el-table-column prop="originalPrice" label="原价"></el-table-column>
          <el-table-column prop="discount" label="优惠"></el-table-column>
        </el-table>
      </el-dialog>

      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { searchOrders } from '@/api/order'
import { mapGetters } from 'vuex'
export default {
  name: 'Search',
  data () {
    return {
      loading: false,
      searchForm: {
        accountId: '',
        orderId: '',
        productId: '',
        type: '',
        priceRange: [0, 1000]
      },
      orders: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectedOrderDetails: [],
      detailsVisible: false
    }
  },
  methods: {
    mapOrderPayStatus (payStatus) {
      if (payStatus === 'pending') {
        return '待支付'
      } else if (payStatus === 'paid') {
        return '已支付'
      } else if (payStatus === 'cancelled') {
        return '已取消'
      } else {
        return '未知'
      }
    },
    mapOrderMealStatus (mealStatus) {
      if (mealStatus === 'preparing') {
        return '备餐中'
      } else if (mealStatus === 'readyForPickup') {
        return '待取餐'
      } else if (mealStatus === 'pickedUp') {
        return '已取餐'
      } else {
        return '未知'
      }
    },
    async handelSearchOrders () {
      this.loading = true
      // 调用 Vuex action 来搜索订单
      const params = {
        ...this.searchForm,
        merchantId: this.user.merchantId,
        minSalePrice: this.searchForm.priceRange[0],
        maxSalePrice: this.searchForm.priceRange[1],
        page: this.currentPage,
        limit: this.pageSize
      }
      try {
        console.log('params', params)
        const response = await searchOrders(params)

        console.log(response)
        if (response.success) {
          this.orders = response.data.orders
          this.total = response.data.total
          if (this.orders.length === 0) {
            this.$message.info('没有找到相关订单')
          }
        }
      } catch (error) {
        this.$message.error(error.message || '搜索失败')
      } finally {
        this.loading = false
      }
    },
    handlePageChange (page) {
      this.currentPage = page
      this.handelSearchOrders() // 重新搜索当前页的订单
    },
    showDetails (order) {
      this.selectedOrderDetails = order.details
      this.detailsVisible = true
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('sidebar', ['isSmallScreen', 'isWideScreen', 'isMediumScreen']),
    searchWrapper () {
      const style = {}
      if (this.isSmallScreen) {
        style.padding = '5rem 0'
        style.height = 'initial'
      } else {
        style.height = '100%'
      }
      return style
    }
  }
}
</script>

<style lang="scss">
.search {
  height:100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-wrapper {
  padding: 0.5rem 1rem;
  height:85%;
  width: 95%;
  border-radius: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .btn {
    background-color: #42b983;
    border-radius: 0.8rem;
    font-size: 110%;
    font-weight: bold;
    opacity: 1;
    transition: all 0.5s;
    &:hover {
      opacity: 0.8;
    }
  }
}

</style>

<style>
.el-slider__bar {
  background-color: #4CAF50;
}
.el-tooltip.el-slider__button{
  border: 2px solid #4CAF50;
}
</style>
