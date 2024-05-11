<template>
  <div class="shop-page-container">
    <div class="merchant-tags">
      <div class="merchant-tags-wrapper">
        <div class="merchant-tag" v-for="(tag, tag_index) in merchantTags" :key="tag_index">
          <div class="merchant-tag-wrapper">
            <span class="text" @click="handelChangeMerchant(tag.merchantId)">{{ tag.storeName }}</span>
            <i class="icon el-icon-close" @click="handelCloseMerchant(tag.merchantId)"></i>
          </div>
        </div>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ShopPage',
  data () {
    return {
    }
  },
  methods: {
    async handelChangeMerchant (id) {
      // 跳转路由
      await this.$router.push({ name: 'merchantDetails', params: { merchantId: id } })
      // 更新当前商家商品信息
      await this.$store.dispatch('merchant/fetchProducts', id)
      // await this.$store.dispatch('merchant/updateMerchantDetails', id)
      await this.$store.dispatch('merchant/fetchMerchantDetails', id)
    },
    handelCloseMerchant (id) {
      this.$store.dispatch('merchant/removeMerchantTag', id)
    }
  },
  computed: {
    ...mapGetters('merchant', ['merchantTags'])
  },
  watch: {
    merchantTags (newVal) {
      if (this.merchantTags.length === 0) {
        this.$router.push({ name: 'home' })
      }
    }
  },
  mounted () {
    console.log('merchantTags', this.merchantTags)
  }

}
</script>

<style scoped lang="scss">
.shop-page-container {
  width: 100%;
  flex: 1;
  position: relative;

  .merchant-tags {
    width: 100%;
    padding: 0.5rem;

    .merchant-tags-wrapper {
      overflow-y: scroll;
      scrollbar-width: none;
      display: flex;
      gap: 1rem;

      .merchant-tag {
        display: flex;
        justify-content: space-between;
        border: 2px solid rgba(33, 176, 93, 0.8);
        background-color: rgba(127, 255, 212, 0.3);
        font-size: 116%;
        font-weight: bold;
        color: #3f8666;
        border-radius: 1rem;
        cursor: pointer;
        align-items: center;
        transition: all 0.2s ease-in-out;
        &:hover {
          opacity: 0.8;
        }
        padding: 0 0.5rem;

        .merchant-tag-wrapper {
          height: 3rem;
          width: 9rem;
          display: flex;
          justify-content: flex-end;
          position: relative;
          align-items: center;
          //padding: 0.5rem 1.5rem;
          .text {
            flex-grow: 1;
          }
          .icon {
            position: absolute;
          }
        }
      }
    }
  }
}
</style>
