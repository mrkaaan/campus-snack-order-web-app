<template>
  <li class="skeleton-item">
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
</template>

<script>
export default {
  name: 'MerchantSkeletonItem'
}
</script>

<style scoped lang="scss">
@import '../styles/multi';
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
</style>
