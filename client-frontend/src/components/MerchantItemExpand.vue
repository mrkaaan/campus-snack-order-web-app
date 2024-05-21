<template>
  <a class="merchant-item-link">
    <div class="merchant-item">
      <div class="merchant-item-wrapper" style=" display: flex; flex-direction: row">
        <div class="item-l">
          <div class="item-img" style="width: 8rem;">
            <el-image class="image" :src="`${baseUrl}/${merchant.image}`" fit="cover" @load="() => merchant.imageLoaded = true"></el-image>
          </div>
        </div>
        <div class="item-r" style="flex:1; display: flex; flex-direction: column">
          <div class="item-detail">
            <p class="detail-title"><strong>{{ merchant.storeName }}</strong></p>
            <div class="item-wrapper">
              <div class="detail-column column-left">
                <div class="detail-row">
                  <div class="detail-rating">
                    <el-rate v-model="merchant.rating" disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']"/>
                    <p class="detail-text detail-rating">{{ merchant.rating }}分</p>
                  </div>
                </div>
                <div class="detail-row">
                  <p class="detail-text detail-price">人均 ￥{{ merchant.priceRange[0] }}-{{ merchant.priceRange[1] }}</p>
                </div>
                <div class="detail-row">
                  <div class="detail-dish-list">
                    <div class="detail-dish" v-for="(dish, index) in merchant.mainDish" :key="`dish-${index}-${dish}`">
                      <p class="detail-text">{{ dish }}</p>
                      <span v-if="index < merchant.mainDish.length - 1" class="separator">|</span>
                    </div>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-tag">
                    <i class="el-icon-dish"></i>
                    <p class="detail-text">{{ merchant.operatingHours }}</p>
                  </div>
                </div>
              </div>
              <div class="detail-column column-right">
                <div class="detail-row">
                  <div class="detail-local">
                    <i class="el-icon-location-outline"></i>
                    <p class="detail-text">{{ merchant.locationDescription }}</p>
                  </div>
                </div>
                <div class="detail-row">
                  <p class="detail-text">月售{{ merchant.monthlySales }}+</p>
                </div>
              </div>
            </div>
          </div>
          <div class="item-product-box" style="height: 100%; overflow-y: scroll; scrollbar-width: none; width: 50rem">
            <div class="item-products" v-if="merchant.products"  style="display: flex; flex-direction: row; overflow: scroll; justify-content: start; gap: 1rem;scrollbar-width: none;">
              <div class="item-product" style="display: flex; flex-direction: column; min-width: 8rem;" v-for="(p, p_index) in merchant.products" :key="`${p_index}-${p.name}-${p.productId}`">
                <div class="p-image" style="width: 8rem; height: 5rem; background-color: #999; border-radius: 1rem;">
                  <img src="" alt="">
                </div>
                <div class="p-des" style="width: 8rem; display: flex; flex-direction: row; text-overflow: ellipsis; font-size: 80%; color: #666; gap:0.3rem; white-space: nowrap;">
                  <span>{{ p.name }}</span>  <span style="color: #E53935; font-size: 90%; font-weight: bold;">￥ {{ p.salePrice }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'MerchantItem',
  data () {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      merchant: {}
    }
  },
  props: ['item'],
  created () {
    console.log('process.env.VUE_APP_BASE_URL', process.env.VUE_APP_BASE_URL)
    this.merchant = {
      ...this.item,
      rating: parseInt(this.item.rating)
    }
    console.log(this.merchant)
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.merchant-item-link {
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
}

.merchant-item {
  overflow: hidden;
  padding: 0.5rem;
  @extend .box-shadow-2;
  border-radius: 1rem;

}

.merchant-item-wrapper {
  display: flex;
  flex-direction: row;
}

.item-img {
  width: 8rem;
  height: 8rem; // 保持图片的高度与项目一致
  object-fit: cover; // 确保图片覆盖整个区域
  border-radius: 1rem 1rem; // 为图片添加圆角，仅左侧
  overflow: hidden;

  .image {
    height: 100%;
    width: 100%;
  }
}

.item-detail {
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 0.5rem 1rem; // 给详情文本添加一些左边距
  display: flex;
  flex-direction: column;
  gap: 0.1rem;

  .detail-title {
    display: flex;
    justify-content: start;
    font-size: 110%;
  }

  .item-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    font-size: 85%;
    overflow: hidden; /* 防止文本溢出 */
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $dark-gray;

    .detail-column {
      height: 100%;
      display: flex;
      flex-direction: column;
      //gap:0.5rem;
      //justify-content: space-between;
    }

    .column-left {
      flex: 8 0 auto;
      align-items: start;
      gap: 0.5rem;
    }

    .column-right {
      flex: 1 0 auto;
      align-items: end;
    }

    .detail-row {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    .detail-tag {
      @extend .tag-orange-1;
    }

    .detail-rating {
      color: $orange;
    }

    .detail-price {
      color: $orange;
    }

    .detail-local {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.2rem;
    }

    .detail-rating {
      display: flex;
      flex-direction: row;
      align-items: center;
      //gap:0.2rem;
    }

    .detail-dish-list {
      @extend .tag-red-1;

      .detail-dish {
        display: flex;
        gap: 0.2rem;
        flex-direction: row;
        //align-items: center;
      }
    }

    .separator {
    }
  }

}

</style>
