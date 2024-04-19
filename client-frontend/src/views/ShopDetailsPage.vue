<template>
  <div>
    <div class="shop-details-container">
      <div class="shop-header" :style="headerStyle"><div class="header-wrapper">
        <el-button type="text" icon="el-icon-search"></el-button>
        <el-button type="text" icon="el-icon-message"></el-button>
        <el-button type="text" icon="el-icon-star-off"></el-button>
      </div></div>
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

import { mapState } from 'vuex'

export default {
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
    ...mapState('header', ['currentScroll', 'lastScroll', 'headerHeight']),
    headerStyle () {
      let opacity = 0 // 初始透明度为0，完全透明
      const effectiveHeight = this.headerHeight || 100 // 如果headerHeight为0或未定义，使用100作为默认高度

      if (this.currentScroll >= 0 && this.currentScroll <= effectiveHeight * 5) {
        // 计算透明度
        opacity = this.currentScroll / effectiveHeight
      } else if (this.currentScroll > effectiveHeight * 5) {
        // 如果滚动距离超过 headerHeight，透明度固定为1
        opacity = 1
      }

      // 计算颜色从白色到黑色的渐变
      const colorValue = Math.floor(255 * (1 - opacity)) // 从 255 (白色) 减到 0 (黑色)
      // 返回用于绑定的样式对象
      return {
        backgroundColor: `rgba(255, 255, 255, ${opacity})`, // 假设背景色为白色，调整透明度
        color: `rgb(${colorValue}, ${colorValue}, ${colorValue})` // 从白色渐变到黑色
      }
    },
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
  height: 100%;
  //overflow: hidden;
  position: relative;
  .shop-header {
    position: sticky;
    top: 0;
    transition: background-color 0.3s;
    z-index: 1000;
    display: flex;
    justify-content: right;
    align-items: center;
    column-gap: 0.4rem;
    padding:0.5rem 1rem;
    color: white;

    .header-wrapper{
      height: 3.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      color: inherit;
      .el-button {
        color: inherit;
        //color: white;
        transition: color 0.3s;
        @extend .big-icon-size;
      }
    }
  }
  .image-container {
      width: 100%;
      position: absolute;
      transform: translateY(-4.5rem);
      height: 20rem;
      img {
        width: 100%;
        height: 100%;  // 使图片高度充满容器
        display: block;  // 去除图片下方的空隙
        user-select: none;  // 防止用户选择图片
        pointer-events: none;  // 图片不接受鼠标事件
        object-fit: cover;  // 保持图片的宽高比，多余的部分会被裁剪
      }
  }
  .shop-brand {
    position: relative;
    padding: 6rem 1rem 1rem;
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
    //transform: translateY(-10rem);
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
