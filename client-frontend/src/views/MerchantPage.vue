<template>
  <div class="shop-page-container">
    <div class="merchant-tags">
      <div class="merchant-tags-wrapper">
        <div class="merchant-tag"><div class="merchant-tag-wrapper"><span class="text">首页</span><i class="icon el-icon-close"></i></div></div>
        <div class="merchant-tag"><div class="merchant-tag-wrapper"><span class="text">首活动管理</span><i class="icon el-icon-close"></i></div></div>
        <div class="merchant-tag"><div class="merchant-tag-wrapper"><span class="text">首活动列表</span><i class="icon el-icon-close"></i></div></div>
        <div class="merchant-tag"><div class="merchant-tag-wrapper"><span class="text">首活动详情</span><i class="icon el-icon-close"></i></div></div>

        <!--        <el-breadcrumb-item><el-tag type="success" closable>首页</el-tag></el-breadcrumb-item>-->
        <!--        <el-breadcrumb-item><el-tag type="success" closable>活动管理</el-tag></el-breadcrumb-item>-->
        <!--        <el-breadcrumb-item><el-tag type="success" closable>活动列表</el-tag></el-breadcrumb-item>-->
        <!--        <el-breadcrumb-item><el-tag type="success" closable>活动详情</el-tag></el-breadcrumb-item>-->
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ShopPage'

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
