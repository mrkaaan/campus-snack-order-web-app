<template>
  <div class="skeleton-wrapper">
    <el-skeleton class="skeleton" animated v-for="row in rows" :key="row">
      <template #template>
        <div class="skeleton-items">
          <div class="skeleton-item" v-for="col in cols" :key="col">
            <el-skeleton-item class="skeleton-item-img"/>
            <div class="skeleton-item-txts">
              <el-skeleton-item class="skeleton-item-txt"/>
              <el-skeleton-item class="skeleton-item-txt"/>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
export default {
  name: 'CustomSkeleton',
  props: {
    rows: {
      type: Number,
      default: 1 // 默认值为1行
    },
    cols: {
      type: Number,
      default: 4 // 默认值为4列
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.skeleton {
  height: 100%;
  width: 100%;
  .skeleton-items {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .skeleton-item {
    height: 100%;
    width: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .skeleton-item-img{
      height: 40%;
      width: 4rem;
    }
    .skeleton-item-txts {
    //height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }
    .skeleton-item-txt {
      width: 100%;
    }
  }
}
</style>
