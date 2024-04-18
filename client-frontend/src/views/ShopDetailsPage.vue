<template>
  <div>
    <div class="shop-details-container">
      <page-header class="shop-header"></page-header>
      <div class="image-container">
        <img src="https://via.placeholder.com/600x300?text=Shop+Details" alt="Shop Details">
      </div>
      <div class="shop-brand">
        <div class="brand-wrapper">
          <h1>{{ merchant.storeName }}</h1>
        </div>
      </div>

      <div class="content">
        <div class="content-wrapper">
          <div class="menu">
            <div class="menu-wrapper">
              <div class="selected" :style="{ 'transform': backgroundPosition }">
                <div class="selected-wrapper"/>
              </div>
              <ul>
                <li v-for="item in menuItem" :key="item.id" class="nav-item" @click="selectBottomNvaTab(item)" :class="{active: currentBottomNavTag === item.id}">
                  {{ item.text }}
                </li>
              </ul>
            </div>
            <hr/>
          </div>
          <div class="container">
            <div class="food-menu">
              <ul class="list">
                <li v-for="n in 20" :key="n">
                  <div class="hover-target">
                    <div class="text-content">分类{{ n }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="food-list">
              <div class="food-item" v-for="n in 100" :key="n">
                <div class="item-wrapper">
                  <p >Content {{ n }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  components: { PageHeader },
  data () {
    return {
      merchant: {}, // 商家详情数据
      startY: 0,
      currentY: 0,
      scale: 1,
      menuItem: [
        { id: 'home', icon: 'el-icon-shopping-bag-2', text: '点餐', route: '/home', badge: 0 },
        { id: 'cart', icon: 'el-icon-shopping-cart-full', text: '评价', route: '/cart', badge: 5 },
        { id: 'message', icon: 'el-icon-chat-line-round', text: '商家', route: '/message', badge: 3 }
      ],
      currentBottomNavTag: 'home'
    }
  },
  computed: {
    // 计算背景移动的距离
    backgroundPosition () {
      const index = this.menuItem.findIndex(item => item.id === this.currentBottomNavTag)
      const width = 300 / this.menuItem.length // 计算每个nav-item占据的百分比宽度
      return `translateX(${index * width}%)`
    }
  },
  created () {
    this.fetchMerchantDetails(this.$route.params.shopId)
  },
  methods: {
    fetchMerchantDetails (shopId) {
      this.merchant.storeName = shopId
      // 实现根据 shopId 获取商家详情的逻辑
    },
    selectBottomNvaTab (item) {
      this.currentBottomNavTag = item.id
    }

  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.shop-details-container {
  overflow: hidden;
  position: relative;
  .shop-header {
    position: fixed;
    width: 100%;
    background-color: transparent;
    z-index: 100;
  }
  .image-container {
      //height: 20rem;
      img {
        width: 100%;
        display: block; // Removes bottom margin/gap
        user-select: none; // Prevents dragging image
        pointer-events: none; // Prevents image from capturing mouse events
      }
  }
  .shop-brand {
    transform: translateY(-10rem);
    padding: 1rem;
    .brand-wrapper{
      background-color: $primary-color;
      width: 100%;
      height: 12rem;
      border-radius: 1rem;
      @extend .box-shadow-3;
    }
  }
  .content {
    padding: 0 1rem;
    transform: translateY(-10rem);
    .content-wrapper {
      @extend .box-shadow-3;
      .menu {
        padding: 1rem 0;
        .menu-wrapper{
          position: relative;
          width: 50%;
          .selected {
            opacity: 0.8;
            z-index: 100;
            text-align: center;
            position: absolute;
            display: flex;
            justify-content: center;
            bottom: -0.2rem; /* 根据需要调整 */
            height: 10%; /* 背景块的高度 */
            width: calc(100% / 3); /* 假设有4个nav-item */
            transition: transform 0.3s ease; /* 平滑过渡效果 */
            .selected-wrapper{
              background-color: $green-light3;
              height: 100%;
              width: 25%;
              border-radius: 20%;
            }
          }
          ul {
             /* 横向排布ul */
            list-style: none;
            display: flex;
            justify-content: space-around;
            .active {
              font-weight: bold;

            }

            li {
              cursor: pointer;
              //display: inline;
              width: 100%;
              letter-spacing: 0.5rem;
              text-indent: 0.5rem;
            }
          }
        }
        hr {
          transform: translateY(0.1rem);
        }
      }
      .container {
        display: flex;
        .food-menu {
          width: 20%;
          .list {
            background-color: $light-gray;
            li {
              cursor: pointer;
              padding: 0.5rem 0;
              height: 3rem;
              background-color: $light-gray;
              border-radius: 1rem;
              position: relative;
              z-index: 200; // 设置默认 z-index 较高
              .hover-target {
                background-color: $light-gray;
                height: 100%;
                transition: transform 0.3s;
                transform-origin: center;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              &:hover {
                z-index: 199; // 提升 hover 的 li 的 z-index
                .hover-target {
                  transform: scaleY(2);
                  background-color: $primary-color;
                }
                .text-content {
                  transform: scaleY(0.5); // 反向缩放以抵消 hover-target 的放大
                }
              }
              .text-content {
                transition: transform 0.3s; // 平滑过渡效果
              }
            }
          }

        }
        .food-list {
          width: 80%;
        }
      }
    }
  }
}

</style>
