<!-- CartComponent.vue -->
<template>
  <div>
    <h1>商家购物车</h1>
    <CartItem v-for="item in filteredCartItems" :key="item.id" :item="item" />
  </div>
</template>

<script>
import CartItem from '@/components/CartItem.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'CartComponent',
  components: {
    CartItem
  },
  props: ['currentSellerId'],
  computed: {
    ...mapGetters('cart', ['cartItems']),
    filteredCartItems () {
      return Object.values(this.cartItems).filter(item => item.sellerId === this.currentSellerId)
    }
  }
}
</script>
