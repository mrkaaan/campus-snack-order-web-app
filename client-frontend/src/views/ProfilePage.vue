<template>
  <div class="profile-page" style="height: 100%" :style="isSmallScreen ? {paddingBottom: '6rem'} : {paddingBottom: '0'}">
    <div class="profile-page-wrapper" v-if="false" style="height: 100%">
      <div class="details">
        <div class="details-wrapper">
          <div class="details-image">
            <div class="details-image-wrapper">
              <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="">
            </div>
          </div>
          <div class="details-info" v-if="currMode !== 'guest'">
            <div class="info-name">
              <h1>{{ infoUser.name }}</h1>
            </div>
            <div class="info-intro">
              <p>用户简介</p>
            </div>
          </div>
          <div class="details-info" v-else style="justify-content: center;">
            <div class="info-login" @click="$router.push('/initial')">
              <h1>点击登录</h1>
            </div>
          </div>
          <div class="details-setup">
            <button class="btn btn-primary"><i class="el-icon-setting"></i></button>
          </div>
        </div>
      </div>
      <div class="profile-page-contents">
        <div class="profile-page-content" style="height: 10rem">
          <template>
            <custom-skeleton :rows="1" :cols="3"/>
          </template>
        </div>
        <div class="profile-page-content" style="height: 10rem">
          <template>
            <custom-skeleton :rows="1" :cols="3"/>
          </template>
        </div>
        <div class="profile-page-content" style="height:20rem">
          <template>
            <custom-skeleton :rows="2" :cols="4"/>
          </template>
        </div>
        <div class="profile-page-content" style="height: 10rem">
          <template>
            <custom-skeleton :rows="1" :cols="4"/>
          </template>
        </div>
      </div>
      <div class="profile-page-contents">
        <div class="profile-page-content log-out" @click="handleLogOut" style="height: 3rem">
          退出登录
        </div>
      </div>
    </div>
    <user-card></user-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomSkeleton from '@/components/CustomSkeleton.vue'
import UserCard from '@/components/UserCard.vue'
export default {
  name: 'ProfilePage',
  components: {
    UserCard,
    CustomSkeleton
  },
  methods: {
    async handleLogOut () {
      try {
        await this.$store.dispatch('auth/clearAuth')
        await this.$router.push('/initial')
      } catch (err) {
        this.$message.info(err.message)
      }
    }
  },
  computed: {
    ...mapGetters('sidebar', ['isSmallScreen']),
    ...mapGetters('auth', ['user', 'mode', 'isGuest']),
    userInfo () {
      return {
        accountId: this.isGuest ? '游客访问' : (this.user.accountId || '未设置'),
        username: this.isGuest ? '游客访问' : (this.user.username || '未设置'),
        email: this.isGuest ? '游客访问' : (this.user.email || '未设置'),
        hasPassword: this.isGuest ? '游客访问' : (this.user.hasPassword ? '已设置' : '未设置'),
        mode: this.mode
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '../styles/multi';
.profile-page {
  background-color: $lighter-gray;
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 100%;
}

.profile-page-wrapper {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.details {
  padding-top: 2rem;
}
.details-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 10rem;
  width: 100%;
  gap: 1.5rem;

  .details-image {
    height: 100%;
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    .details-image-wrapper{
      width: 10rem; /* 容器的宽度 */
      height: 10rem; /* 容器的高度，保持宽高一致以形成圆形 */
      border-radius: 50%; /* 设置边框半径为容器尺寸的50%来创建圆形 */
      overflow: hidden; /* 隐藏超出容器部分的图片 */
      display: flex; /* 使用弹性盒子布局 */
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
      img {
        width: 100%; /* 让图片宽度填满容器宽度 */
        height: 100%; /* 高度自适应以保持图片比例 */
        object-fit: cover; /* 覆盖整个容器，多余的部分被裁剪 */
      }
    }
  }
  .details-info {
    flex:8;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 2rem;
    .info-name, .info-intro, .info-login {
      //flex: 1;
    }
    .info-login {
      cursor: pointer;
      font-weight: bold;
      font-size: 180%;
    }
    .info-name {
      font-weight: bold;
      font-size: 160%;

    }
  }
  .details-setup {
    height: 100%;
    width: 100%;
    flex: 2;
    //margin-left: auto;
    .btn {
      font-size: 180%;
      font-weight: bold;
    }
  }
}

.profile-page-contents {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.profile-page-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $primary-color;
  border-radius: 1rem;
  flex-direction: column;
}
.log-out {
  cursor: pointer;
  &:hover {
    background-color: $light-gray;
  }
}
</style>

<style>
.el-skeleton {
  height: 100%;
}
</style>
