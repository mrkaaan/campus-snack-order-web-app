<template>
  <BottomNav>
    <div class="nav-background" :style="{ 'transform': backgroundPosition }">
      <div class="nav-background-content"></div>
    </div>
    <div v-for="item in navItems" :key="item.id" class="nav-item" @click="selectBottomNvaTab(item)" :class="{active: currenBottomNavTag === item.id}">
      <!-- 使用el-badge时判断是否有badge值，且大于0 -->
      <el-badge v-if="item.badge" :value="item.badge" class="nav-icon">
        <i :class="[item.icon, 'big-icon-size']"></i>
      </el-badge>
      <!-- 不显示badge的情况下直接显示图标 -->
      <template v-else>
        <i :class="[item.icon, 'big-icon-size', 'nav-icon']"></i>
      </template>
      <span>{{ item.text }}</span>
    </div>
  </BottomNav>
</template>

<script>
import BottomNav from './BottomNav.vue' // 确保路径正确

export default {
  name: 'CustomBottomNav',
  components: {
    BottomNav
  },
  data () {
    return {
      navItems: [
        { id: 'home', icon: 'el-icon-shopping-bag-2', text: '商店', route: '/home', badge: 0 },
        { id: 'cart', icon: 'el-icon-shopping-cart-full', text: '购物车', route: '/cart', badge: 5 },
        { id: 'message', icon: 'el-icon-chat-line-round', text: '消息', route: '/message', badge: 3 },
        { id: 'profile', icon: 'el-icon-user-solid', text: '我的', route: '/profile', badge: 0 }
      ],
      currenBottomNavTag: 'home', // 当前选中的标签页
      cartCount: 5, // 购物车商品数量
      messageCount: 3 // 未读消息数量
    }
  },
  computed: {
    // 计算背景移动的距离
    backgroundPosition () {
      const index = this.navItems.findIndex(item => item.id === this.currenBottomNavTag)
      const width = 400 / this.navItems.length // 计算每个nav-item占据的百分比宽度
      return `translateX(${index * width}%)`
    }
  },
  methods: {
    // 选中底部标签
    selectBottomNvaTab (item) {
      this.currenBottomNavTag = item.id // 切换选中的标签页
      this.$router.push(item.route)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.nav-background {
  z-index: 100;
  text-align: center;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0; /* 根据需要调整 */
  height: 100%; /* 背景块的高度 */
  width: calc(100% / 4); /* 假设有4个nav-item */
  transition: transform 0.3s ease; /* 平滑过渡效果 */
  .nav-background-content {
    background-color: rgba(127, 255, 212, 0.3); /* 背景颜色 */
    height: 80%;
    width: 90%;
    border-radius: 0.9375rem;
  }
}

.nav-item {
  z-index: 101;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  padding: 0.625rem 0;
  transition: all 0.3s ease;

  .nav-icon {
    transform: translateX(0.5rem); /* 假设当span显示时，i标签向右移动1.25rem */
    transition: transform 0.3s ease;
  }
  span {
    opacity: 0;
    transition: opacity 0.3s;
  }
}

.nav-item.active {
  font-weight: bold;

  .nav-icon{
    color: $green;
    transform: translateX(-0.5rem); /* 假设当span显示时，i标签向右移动1.25rem */

  }
  span {
    opacity: 1;
    color: black;
  }
}
</style>
