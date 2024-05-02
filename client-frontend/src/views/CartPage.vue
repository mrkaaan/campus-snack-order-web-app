
<template>
  <div>
    <h1>购物车</h1>
    <cart-item v-for="item in cartItems" :key="item.id" :item="item"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CartPage',
  computed: {
    ...mapGetters('cart', ['cartItems'])
  }
}
</script>

<style scoped lang="scss">

</style>
