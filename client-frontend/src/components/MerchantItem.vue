<template>
  <a class="merchant-item-link">
    <div class="merchant-item">
      <div class="item-img">
        <el-image class="image" :src="`${baseUrl}/${merchant.image}`" fit="cover" @load="() => merchant.imageLoaded = true"></el-image>
        <!--        <img :src="" alt="image" class="image">-->
      </div>
      <div class="item-detail" :style="itemDetailStyle">
        <p class="detail-title"><strong>{{ merchant.storeName }}</strong></p>
        <div class="item-wrapper">
          <div class="detail-column column-left">
            <div class="detail-row">
              <div class="detail-rating">
                <el-rate v-model="merchant.rating" disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']"/>
                <p class="detail-text detail-rating">{{ merchant.rating.toFixed(1) }}分</p>
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
    </div>
  </a>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MerchantItem',
  data () {
    return {
      merchant: {},
      baseUrl: process.env.VUE_APP_BASE_URL
    }
  },
  props: ['item'],
  created () {
    console.log('process.env.VUE_APP_BASE_URL', process.env.VUE_APP_BASE_URL)
    this.merchant = JSON.parse(JSON.stringify(this.item))
  },
  computed: {
    ...mapGetters('sidebar', ['isSmallScreen', 'isWideScreen', 'isMediumScreen']),
    itemDetailStyle () {
      const style = {}
      if (this.isSmallScreen) {
        ;
      } else {
        style.flex = 1
      }

      return style
    }
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

  .merchant-item {
    width: 100%;
    height: 10rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    @extend .box-shadow-2;

    .item-img {
      width: 10rem;
      height: 100%; // 保持图片的高度与项目一致
      object-fit: cover; // 确保图片覆盖整个区域
      border-radius: 1rem 0 0 1rem; // 为图片添加圆角，仅左侧
      overflow: hidden;

      .image {
        height: 100%;
        width: 100%;
      }
    }

    .item-detail {
      //flex: 1;
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
  }
}
</style>
