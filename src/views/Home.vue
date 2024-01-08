<template>
  <el-container class="home-container">
    <el-aside width="200px" class="home-aside">
      <div class="aside-top">
        <div class="logo-box">
          <div class="logo" />
        </div>
        <div class="logo-text">
          <span class="logo-text-ch">订餐管理后台</span>
          <span class="logo-text-en">CampusSnackManager</span>
        </div>
      </div>
      <div class="aside-bottom">
        <el-menu class="navigation-menu-bar" default-active="0">
          <el-menu-item v-for="(item, index) in navBarData" :index="index.toString()" :key="item.icon">
            <div class="nav-menu-item" style="padding:0" @click="$router.push({path:item.to})">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.label }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <el-container class="home-content">
      <el-header class="home-header">
        <div class="user-box">
          <el-avatar class="user-avatar" size="medium" :src="circleUrl" v-popover:user-avatar-popover></el-avatar>
          <el-popover
            ref="user-avatar-popover"
            placement="bottom"
            title="管理员"
            width="200"
            trigger="click"
            content="Null">
          </el-popover>
        </div>
      </el-header>
      <el-main class="home-main">
        <el-row class="bread-crumb-box">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item class="bread-item" v-for="item in breadcrumbInformation" :key="item.value" :to="{path: item.to}">{{ item.label }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
        <el-row class="main-content main-row">
          <el-col class="main-col" :span="24">
            <el-card class="main-container" shadow="never">
              <router-view></router-view>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
  },
  data () {
    return {
      navBarData: [
        { icon: 'el-icon-s-home', label: '首页', to: '/dashboard' },
        { icon: 'el-icon-s-order', label: '订单管理', to: '/order' },
        { icon: 'el-icon-s-management', label: '用户管理', to: '/user' },
        { icon: 'el-icon-s-shop', label: '商家管理', to: '/merchant' },
        { icon: 'el-icon-s-comment', label: '用户反馈', to: '/free-back' },
        { icon: 'el-icon-setting', label: '系统设置', to: '/system' }
      ],
      circleUrl: require('@/assets/imgs/user/user-avatar-2.png'),
      breadcrumbInformation: [
        { label: '首页', value: 'home', to: '/' }
      ]
    }
  },
  created () {
    document.title = '管理系统'
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;

  .home-aside {
    background-color: $primary-color;
    border-right: 1px solid $border-color;

    .aside-top {
      @include flex-cc;
      //margin: 5px 15px 15px;
      height: 60px;
      column-gap: 10px;

      .logo-box {
        .logo {
          border-radius: 20%;
          height: 40px;
          width: 40px;
          background-image: url("../assets/imgs/logo/logo-bg-thum.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
      }

      .logo-text {
        display: flex;
        justify-content: start;
        text-align: left;
        flex-direction: column;

        .logo-text-ch {
          font-size: 20px;
          font-weight: 800;
        }
        .logo-text-en {
          font-size: 12px;
          color: #666;
        }
      }
    }
    .aside-bottom {
      overflow: hidden;

      .navigation-menu-bar {
      }
    }
  }

  .home-header {
    background-color: $primary-color;

    .user-box {
      height: 100%;
      @include flex-ec;

      .user-avatar {
        cursor: pointer;
      }
    }
  }

  .home-main {
    background-color: $secondary-color;
    display: flex;
    flex-direction: column;

    .bread-crumb-box {
      display: none;
      margin-bottom: 5px;

      .bread-item {
      }
    }
    .main-row,
    .main-col,
    .main-container {
      height: 100%;
    }
    .main-container {
      @include flex-cc;
    }
  }
}
</style>
