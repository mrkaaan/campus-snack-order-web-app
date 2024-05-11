<template>
  <div class="product-management">
    <div class="product-man-wrapper">
      <el-button class="btn" type="success" @click="changeDialogVisible(true)">新增商品</el-button>
      <el-table :data="products" style="width: 100%">
        <el-table-column property="name" label="商品名"></el-table-column>
        <el-table-column property="categoryName" label="分类"></el-table-column>
        <el-table-column property="salePrice" label="销售价格"></el-table-column>
        <el-table-column property="originalPrice" label="原价"></el-table-column>
        <el-table-column property="portions" label="几人份"></el-table-column>
        <el-table-column property="stock" label="库存"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" @click="changeDialogVisible(true, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="isShowDialog" :key="dialogKey" title="" style="box-shadow: none; background-color: transparent">
      <check-product-card
        :product="currentProduct"
        :isNew="isNew"
        :merchantId="user.merchantId"
        @close="changeDialogVisible(false)"
        @update-success="fetchProducts"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getProducts } from '@/api/check'
import { mapGetters } from 'vuex'
import CheckProductCard from '@/components/CheckProductCard'
export default {
  components: { CheckProductCard },
  data () {
    return {
      products: [],
      isShowDialog: false,
      currentProduct: null,
      isNew: null,
      dialogKey: 0
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'mode', 'isGuest'])
  },
  methods: {
    changeDialogVisible (visible, product = null) {
      this.isShowDialog = visible
      this.currentProduct = product // 如果是编辑，传入当前商品的数据
      this.isNew = product === null // 如果是新增，传入true，如果是编辑，传入false
      this.dialogKey++ // 更新key以重新渲染对话框
    },
    async fetchProducts () {
      try {
        const response = await getProducts({ merchantId: this.user.merchantId })
        this.products = response.data
        console.log('商家商品数据获取成功')
      } catch (error) {
        console.error('商家商品数据获取失败', error)
      }
    }
  },
  created () {
    this.fetchProducts()
  }
}
</script>
<style scoped lang="scss">
.product-management {
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-self: center;

  .btn {
    background-color: #42b983;
    border-radius: 1rem;
    font-size: 110%;
    font-weight: bold;
    opacity: 1;
    transition: all 0.5s;
    &:hover {
      opacity: 0.8;
    }
  }
}
.product-man-wrapper {
  margin: 1rem 0;
  background-color: #fff;
  height: 100%;
  width: 95%;
  padding: 1rem;
  border-radius: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;

}
.check-order {
  position: relative;
  height: 100%;
  width: 100%;
}
.dialog {
  position: fixed;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
}
</style>

<style>
.el-dialog {
  background-color: transparent;
  box-shadow: none;
}
.el-dialog__body {
  justify-content: center;
  display: flex;
  align-items: center;
}
</style>
