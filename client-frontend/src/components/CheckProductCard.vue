<template>
  <div class="box-card">
    <h1 style="font-size: 110%; font-weight: bold">mode</h1>
    <el-form :model="productForm" label-width="120px" class="master-container" >
      <el-form-item label="商品/套餐名">
        <el-input v-model="productForm.name" placeholder="请输入商品/套餐名"></el-input>
      </el-form-item>

      <el-form-item label="商品类型">
        <el-select v-model="productForm.type" placeholder="选择商品类型">
          <el-option label="商品" value="product"></el-option>
          <el-option label="套餐" value="bundle"></el-option>
          <el-input v-model="productForm.type" placeholder="输入新类型"></el-input>
        </el-select>
      </el-form-item>

      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="productForm.description" placeholder="请输入商品描述"></el-input>
      </el-form-item>

      <el-form-item label="原价">
        <el-input-number v-model="productForm.originalPrice" :min="0" label="原价"></el-input-number>
      </el-form-item>

      <el-form-item label="现价">
        <el-input-number v-model="productForm.salePrice" :min="0" label="现价"></el-input-number>
      </el-form-item>

      <el-form-item label="库存">
        <el-input-number v-model="productForm.stock" :min="0" label="库存量"></el-input-number>
      </el-form-item>

      <el-form-item label="商品图片">
        <el-input v-model="productForm.imagePath" placeholder="请输入或粘贴图片URL"></el-input>
      </el-form-item>

      <el-form-item label="商品分类">
        <el-input v-model="productForm.categoryName" placeholder="输入商品分类名称"></el-input>
      </el-form-item>

      <el-form-item class="btn-box">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveProduct } from '@/api/check'
export default {
  name: 'CheckProductCard',
  props: ['product', 'isNew', 'merchantId'],
  data () {
    return {
      productForm: {
        name: '',
        type: 'product',
        description: '',
        originalPrice: 0,
        salePrice: 0,
        stock: 0,
        imagePath: '',
        categoryName: '',
        isNew: this.isNew,
        merchantId: this.merchantId,
        productId: ''
      },
      mode: ''
    }
  },
  watch: {
    product: {
      handler (newValue) {
        this.initForm(newValue)
      },
      immediate: true, // 这确保了组件加载时会立即调用一次 handler
      deep: true // 深度监听对象内部变化
    }
  },
  methods: {
    initForm (product) {
      if (product) {
        this.productForm = {
          name: product.name,
          type: product.type,
          description: product.description,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          stock: product.stock,
          imagePath: product.imagePath,
          categoryName: product.categoryName,
          isNew: this.isNew,
          merchantId: this.merchantId,
          productId: product.productId
        }
        this.mode = '编辑模式'
      } else {
        this.resetForm()
        this.mode = '新增模式'
      }
    },
    async submitForm () {
      try {
        await saveProduct(this.productForm)
        this.$emit('update-success')
        this.$message.success(`${this.mode}成功`)
        this.$emit('close') // 关闭对话框
      } catch (error) {
        this.$message.error(`${this.mode}失败`)
      }
    },
    resetForm () {
      this.productForm = {
        name: '',
        type: 'product',
        description: '',
        originalPrice: 0,
        salePrice: 0,
        stock: 0,
        imagePath: '',
        categoryName: '',
        isNew: this.isNew,
        merchantId: this.merchantId
      }
    }
  }
}
</script>

<style scoped lang="scss">
.box-card {
  width: 100%;
  height: 100%;
  //padding: 3rem;
  transform: translateY(-5rem);
  display: flex;
  justify-content: center;
  align-items: center;
}

.master-container {
  background: #FFFFFF;
  box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  grid-template-columns: auto;
  height: 100%;
  width: 80%;
  border-radius: 2rem;
  padding: 3rem;
}

</style>

<style>
.el-form-item__content,
.label-position {
  display: flex;
}
.btn-box {
  .el-form-item__content,
  .label-position {
    display: contents
  }
}
</style>
