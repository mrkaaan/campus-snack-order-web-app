<template>
  <div class="food-item">
    <div class="food-image">
      <!-- 图片插槽 -->
      <slot name="image"></slot>
    </div>
    <div class="food-description">
      <!-- 描述插槽 -->
      <slot name="description"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodItem'
}
</script>

<style scoped>
.food-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem; /* 底部间距 */
}

.food-image {
  flex: 0 0 30%; /* 图片占据30%的宽度，不允许伸缩 */
  padding-right: 1em; /* 图片和描述之间的间距 */
}

.food-description {
  flex: 1; /* 描述占据剩余空间 */
}
</style>
