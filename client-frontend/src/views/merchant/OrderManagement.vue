<script>
import { getOrder } from '@/api/order'

export default {
  name: 'OrderManagement',
  data () {
    return {
      isExpand: true,
      orders: []
    }
  },
  computed: {
    orderStyles () {
      // 获取元素高度
      const style = {}
      if (this.isExpand) {
        ;
      } else {
        ;
      }
      return style
    },
    // 计算属性，用于格式化订单距离当前时间的时间差
    formatOrderTime () {
      return (orderTime) => {
        const now = new Date()
        const timeDiff = now - new Date(orderTime)

        // 将时间差转换为秒数
        const seconds = Math.floor(timeDiff / 1000)

        // 不同的时间段对应的秒数
        const intervals = {
          天: 24 * 60 * 60,
          小时: 60 * 60,
          分钟: 60,
          秒: 1
        }

        // 计算时间差对应的单位
        for (const unit in intervals) {
          const secondsPerUnit = intervals[unit] // 时间单位对应的秒数
          const interval = Math.floor(seconds / secondsPerUnit) // 计算出时间差对应当前时间单位的个数
          if (interval >= 1) {
            return interval + unit + '前'
          }
        }
        return '刚刚'
      }
    }

  },
  methods: {
    handelExpandMore () {
      //   const detail = document.querySelector('.order-co-b')
      //   if (this.isExpand) {
      //     detail.style.height = 0
      //   } else {
      //     detail.style.height = 'auto'
      //     const { height } = detail.getBoundingClientRect()
      //     detail.style.height = 0
      //     // eslint-disable-next-line no-unused-expressions
      //     detail.offsetHeight // 读取几何属性 手动造成回流 重新渲染高度
      //     detail.style.height = `${height}px`
      //   }
      //   this.isExpand = !this.isExpand
    },
    async handelOrderDetail () {
      const merchantId = 1
      try {
        const response = await getOrder({ merchantId: merchantId })
        console.log('订单获取成功', response)
        this.orders = response.data.orders
      } catch (error) {
        console.error('订单获取失败', error)
      }
    },
    updateTimeDisplay () {
      const now = new Date() // 获取当前时间
      this.orders.forEach(order => {
        const orderTime = new Date(order.orderTime) // 获取订单时间
        const secondsDiff = Math.floor((now - orderTime) / 1000) // 计算时间差，单位为秒
        order.timeAgo = this.formatTimeAgo(secondsDiff) // 更新订单的时间显示
      })
    },
    formatTimeAgo (seconds) {
      // 定义时间间隔对应的单位
      const intervals = {
        天: 86400,
        小时: 3600,
        分钟: 60,
        秒: 1
      }

      // 计算时间差对应的单位
      for (const unit in intervals) {
        const secondsPerUnit = intervals[unit]
        const interval = Math.floor(seconds / secondsPerUnit)
        if (interval >= 1) {
          return interval + unit + '前'
        }
      }
      return '刚刚' // 如果时间差小于1秒，则显示“刚刚”
    },
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
    }
  },
  mounted () {
    this.handelOrderDetail()
    // 初始化定时器，每隔一段时间刷新时间显示
    this.updateTimeDisplay()
    this.timer = setInterval(this.updateTimeDisplay, 60000) // 每分钟更新一次
  },
  beforeDestroy () {
    // 在组件销毁时清除定时器，释放资源
    clearInterval(this.timer)
  }
}
</script>

<template>
  <div class="order-page">
    <div style="background-color: #f5f5f5;">
      <div class="order-page-wrapper" v-if="orders.length !== 0">
        <div class="order-content" v-for="(order, order_index) in orders" :key="order_index">
          <div class="order-co-t">
            <div class="order-title">当日流水编号 {{ order.pickupNumber.toString().padStart(3, '0') }}</div>
            <div class="desc">
              <div class="order-time-from">{{ formatOrderTime(order.orderTime) }}</div>
              <div class="order-number">{{ order.orderDdate }}</div>
            </div>
          </div>
          <div class="order-co-b">
            <div class="order-item" v-for="(item, item_index) in order.details" :key="item_index">
              <div class="order-item-image">
                <img src="" alt="">
              </div>
              <div class="order-item-info">
                <div class="order-item-name">
                  {{ item.productName }}
                </div>
                <div class="order-item-info-b">
                  <div class="order-item-price">
                    <span class="sale-price" :class="{ 'item-price': item.totalSalePrice }">
                      ￥{{ item.totalSalePrice === '0.00' ? item.totalOriginalPrice : item.totalSalePrice }}
                    </span>
                    <span v-if="item.totalSalePrice !== '0.00'" class="original-price">
                      ￥{{ item.totalOriginalPrice }}
                    </span>
                  </div>
                  <div class="order-item-count">
                    <div class="count">
                      {{ `x ${item.quantity}`}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-item-details">
              <div class="detail-item">
                <span class="detail-item-title">订单时间</span>
                <span class="detail-item-des">{{ order.orderTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item-title">订单支付状态</span>
                <span class="detail-item-des">{{ mapOrderPayStatus(order.payStatus) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item-title">下单用户</span>
                <span class="detail-item-des">{{ order.userId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item-title">订单金额</span>
                <span class="detail-item-des item-price">￥ {{ order.salePrice }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item-title">餐品状态</span>
                <span class="detail-item-des">{{ mapOrderMealStatus(order.mealStatus) }}</span>
              </div>
            </div>
          </div>
          <div class="oder-co-e">
            <div @click="handelExpandMore">展开</div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无订单数据"></el-empty>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/multi';

  .order-page {
    height: 100%;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
  }
  .order-page-wrapper {
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .order-content {
    background-color: #fff;
    width: 100%;
    min-height: 15rem;
    border-radius: 1rem;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    .order-co-t {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: start;

      .order-title {
        font-size: 120%;
        font-weight: bold;
      }

      .desc {
        display: flex;
        align-items: end;
        justify-content: center;
        font-size: 110%;
        font-weight: bold;
        flex-direction: column;
      }
    }

    .order-co-b {
      gap: 1rem;
      height: 100%;
      position: relative;
      display: grid;
      grid-template-rows: 0fr;
      transition: all 0.5s;
      overflow-y: hidden;
      //height: 0;
      .order-co-b-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
      }

      &:hover {
        grid-template-rows: 1fr;
      }
    }
  }

  .order-item {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    .btn {
      border-radius: 2rem;
      height: 3rem;
      width: 5rem;
      background-color: $green-light3;
      color:$dark-gray;
    }

    .order-item-image {
      height: 5rem;
      width: 5rem;
      background-color: #666666;
    }

    .order-item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .order-item-name {
        align-self: start;
        font-size: 110%;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }

      .order-item-info-b{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  }
  .order-item-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .detail-item {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;

      .detail-item-title {
        font-size: 110%;
      }
      .detail-item-des {
        font-size: 110%;
      }
    }
  }
  .item-price {
    font-weight: bold;
    color: #E53935;
    font-size: 120%;
  }
  .original-price {
    text-decoration: line-through;
    color: #B0BEC5;
    font-size: 80%;
  }

</style>
