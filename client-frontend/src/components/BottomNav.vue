<template>
  <footer class="bottom-nav">
    <div class="bottom-content">
      <!-- 提供插槽 -->
      <slot></slot>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'BottomNav'
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.bottom-nav {
  position: fixed;
  z-index: 1600;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5.625rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease; /* 使用transform进行过渡 */
  transform: translateY(100%); /* 初始状态，位于视口内 */

  .bottom-content {
    background-color: $primary-color;
    border-radius: 0.9375rem;
    @extend .box-shadow;
    height: 80%;
    width: 90%;
    display: flex;
    position: relative;
  }
}
</style>
