<template>
  <el-skeleton :throttle="1000" :loading="!details" style="height: 100%">
    <template slot="template">
      <div class="brand-inner">
        <div class="brand-top">
          <div class="brand-top-l">
            <div class="brand-title">
              <el-skeleton-item variant="h3" style="height: 1.6rem"/>
            </div>
            <div class="brand-info">
              <el-skeleton-item variant="text" style="width: 15%"/>
              <el-skeleton-item variant="text" style="width: 15%"/>
              <el-skeleton-item variant="text" style="width: 15%"/>
            </div>
          </div>

          <div class="brand-top-r">
            <div class="image-wrapper">
              <el-skeleton-item
                class="image"
                variant="image"
              />
            </div>
          </div>
        </div>
        <div class="brand-bottom">
          <el-skeleton-item variant="text"/>
          <el-skeleton-item variant="text"/>
          <div class="brand-tag">
            <el-skeleton-item variant="text" style="width: 10%"/>
            <el-skeleton-item variant="text" style="width: 10%"/>
            <el-skeleton-item variant="text" style="width: 10%"/>
            <el-skeleton-item variant="text" style="width: 10%"/>
          </div>
        </div>
      </div>
    </template>
    <div class="brand-inner">
      <div class="brand-top">
        <div class="brand-top-l">
          <div class="brand-title">
            <h3>{{ details.storeName }}</h3>
          </div>
          <div class="brand-info">
            <p class="rating">{{ details.rating }}分</p>
            <p class="monthlySale">月銷{{ details.monthlySales }}+</p>
          </div>
        </div>

        <div class="brand-top-r">
          <div class="image-wrapper">
            <el-image class="image" :src="details.image" fit="cover"></el-image>
          </div>
        </div>
      </div>
      <div class="brand-bottom">
        <div class="desc">{{ details.description }}</div>
        <div class="brand-tag">
          <div class="isSpecialPrice" v-if="details.hasSpecialPrice">特價商品</div>
          <div class="isDiscount" v-if="details.hasDiscount">折扣商品</div>
        </div>
      </div>
    </div>
  </el-skeleton>

</template>

<script>
export default {
  name: 'detailshopBrand',
  props: {
    details: Object
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';
.el-skeleton {
  width: 100%;
  height: 100%;
}
.brand-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .brand-top {
    flex: 1;
    gap:1rem;
    display: flex;
    flex-direction: row;
    .brand-top-l {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 1rem;
      .brand-title,
      .brand-info {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: row;
      }
      .brand-title {
        font-size: 150%;
        font-weight: bold;
      }
      .brand-info {
        gap: 1rem;
        .rating {
          color: $orange;
        }
      }
    }

    .brand-top-r {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .image-wrapper {
        border-radius: 0.6rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .image {
        width: 4.7rem;
        height: 4.7rem;
      }
    }
  }

  .brand-bottom {
    flex: 1;
    gap:1rem;
    display: flex;
    flex-direction: column;

    .desc,
    .brand-tag {
      flex: 1;
      width: 100%;

      .isDiscount,
      .isSpecialPrice {
        @extend .tag-red-2;
      }
    }

    .desc {
      text-align: left;
      color: $dark-gray;
      overflow: hidden; /* 隐藏超出部分的文本 */
      white-space: nowrap; /* 保持文本在一行内 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      max-width: 100%; /* 限制最大宽度，防止溢出 */
    }
    .brand-tag {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  }
}
</style>
