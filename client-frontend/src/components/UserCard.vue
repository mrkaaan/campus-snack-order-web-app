<template>
  <div class="card-client" :style="cardStyles">
    <div class="user-picture">
      <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
      </svg>
    </div>
    <p class="name-client"> {{ userInfo.mode }}
      <span>{{ isGuest ? '游客' : ''  }}</span>
    </p>
    <div class="social-media">
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; width: 100%">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 50%; gap:1rem">
          <div class="media-item">
            <div class="item-title">
              <a href="#">
                <svg t="1715348990701" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4546"><path d="M848.3 198.7c32.1 0 57.8 8.2 77 24.5 19.2 16.3 28.8 41.1 28.8 74.2v438.2c0 14.2-2.6 27.6-7.9 40.3-5.3 12.6-12.5 23.7-21.7 33.2-9.2 9.5-20 17-32.4 22.5-12.4 5.5-25.4 8.3-39.1 8.3H164.5c-13.7 0-26.6-2.6-38.7-7.9-12.1-5.3-22.6-12.2-31.6-20.9-8.9-8.7-16.1-18.8-21.3-30.4-5.2-11.7-7.9-24.1-7.9-37.2V295.8c0-28.4 8.7-51.7 26.1-69.9 17.4-18.2 41.8-27.2 73.4-27.2h683.8z m-561.4 146c-10 0-19.5 1.8-28.4 5.5-8.9 3.7-16.8 8.8-23.7 15.4-6.8 6.6-12.2 14.5-16.2 23.7s-5.9 19.1-5.9 29.6 2 20.3 5.9 29.2c3.9 8.9 9.3 16.8 16.2 23.7 6.8 6.8 14.7 12.2 23.7 16.2 8.9 3.9 18.4 5.9 28.4 5.9 11.1 0 21.2-2 30.4-5.9 9.2-4 17.1-9.3 23.7-16.2 6.6-6.8 11.8-14.7 15.8-23.7 3.9-8.9 5.9-18.7 5.9-29.2 0-21.6-7.1-39.3-21.3-53.3-14.2-13.9-32.4-20.9-54.5-20.9z m124 273.2c0-10-2-19.6-5.9-28.8-3.9-9.2-9.2-17.1-15.8-23.7-6.6-6.6-14.5-11.8-23.7-15.8-9.2-3.9-18.8-5.9-28.8-5.9H238c-20.5 0-37.9 7.2-52.1 21.7-14.2 14.5-21.3 32-21.3 52.5v74.3h246.3v-74.3z m366.3 78.2c10.5 0 18.3-2.6 23.3-7.9 5-5.3 7.5-11.6 7.5-18.9 0-7.4-2.9-13.8-8.7-19.3-5.8-5.5-13.9-8.3-24.5-8.3H539.5c-10.5 0-18.4 2.8-23.7 8.3-5.3 5.5-7.9 12-7.9 19.3 0 7.4 2.6 13.7 7.9 18.9 5.3 5.3 12.9 7.9 22.9 7.9h238.5z m0.8-101.9c10.5 0 18.2-2.6 22.9-7.9 4.7-5.3 7.1-11.6 7.1-18.9 0-7.9-2.2-14.5-6.7-19.7-4.5-5.3-12-7.9-22.5-7.9H537.2c-10.5 0-18.2 2.6-22.9 7.9-4.7 5.3-7.1 11.8-7.1 19.7 0 7.4 2.2 13.7 6.7 18.9 4.5 5.3 12 7.9 22.5 7.9H778z m0.8-100.2c7.9 0 14.7-2.6 20.5-7.9 5.8-5.3 8.7-11.6 8.7-18.9 0-7.4-2.9-13.3-8.7-17.8-5.8-4.5-12.6-6.7-20.5-6.7H618.5c-7.9 0-14.6 2.2-20.1 6.7-5.5 4.5-8.3 10.4-8.3 17.8s2.8 13.7 8.3 18.9c5.5 5.3 12.2 7.9 20.1 7.9h160.3z" fill="#ffffff" p-id="4547"></path></svg>
                <!--              <span class="tooltip-social">UID</span>-->
              </a>
              <span>UID</span>
            </div>
            <div class="item-des">{{ userInfo.accountId }}</div>
          </div>
          <div class="media-item">
            <div class="item-title">
              <a href="#">
                <svg t="1715352088084" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5596" ><path d="M446.577778 0h126.862222c93.013333 26.737778 175.502222 94.72 203.377778 189.724444 43.804444 131.128889-32.426667 285.866667-160.995556 334.506667-93.866667 28.444444-197.12 17.066667-287.288889 60.017778-141.937778 64-243.768889 205.368889-256.853333 361.244444 167.253333 11.093333 336.782222-14.506667 502.613333 16.213334L554.951111 1024H54.897778c-2.56-37.546667-20.764444-53.475556-54.897778-48.071111v-107.52c42.097778-174.933333 175.502222-318.577778 344.177778-378.595556-52.622222-57.742222-107.235556-123.733333-105.813334-206.506666C228.124444 152.746667 325.973333 37.831111 446.577778 0m-13.653334 93.582222c-131.982222 53.191111-154.168889 252.302222-35.271111 331.662222 112.355556 95.573333 303.217778 5.404444 309.191111-139.093333 18.773333-139.946667-148.195556-260.266667-273.92-192.568889z" fill="#ffffff" p-id="5597"></path><path d="M622.08 651.377778c128.568889-48.924444 268.515556-27.875556 401.92-20.48v69.973333c-112.64 2.844444-226.133333 13.368889-338.488889-0.568889-15.928889-12.231111-47.502222-36.693333-63.431111-48.924444zM651.377778 794.168889c123.164444-18.488889 248.32-6.542222 372.622222-5.973333v73.386666c-124.586667 7.68-250.595556 15.075556-374.613333-3.697778 0.568889-15.928889 1.422222-47.786667 1.991111-63.715555zM655.36 964.835556c116.337778-39.822222 246.897778-8.533333 368.64-13.937778V1024H640.568889l14.791111-59.164444z" fill="#ffffff" p-id="5598"></path></svg>
                <!--              <span class="tooltip-social">用户名</span>-->
              </a>
              <span>用户名</span>
            </div>
            <div class="item-des">{{ userInfo.username }}</div>
          </div>
          <div class="media-item">
            <div class="item-title">
              <a href="#">
                <svg t="1715352185616" class="icon" viewBox="0 0 1040 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6682" ><path d="M818.97651 64.224744 204.713428 64.224744c-113.073288 0-204.714452 93.713358-204.714452 209.238488l0 413.642878c0 115.52513 91.641163 208.357422 204.714452 208.357422l614.262058 0c113.134687 0 204.771757-92.833315 204.771757-208.357422L1023.747243 273.463232C1023.748267 157.939125 932.110173 64.224744 818.97651 64.224744zM709.783599 482.420311l249.786996-150.083204 0 296.587905L709.783599 482.420311zM204.713428 128.026862l614.262058 0c72.988338 0 133.375683 58.618049 139.984195 132.059712L511.875157 528.771989 64.50206 259.912611C71.221088 186.55179 131.840724 128.026862 204.713428 128.026862zM63.87375 332.154959l250.091942 150.266375L63.87375 629.103068 63.87375 332.154959zM818.97651 831.417867 204.713428 831.417867c-72.79391 0-133.36238-57.398268-140.190903-130.530892l309.642223-181.605128c0.189312-0.11461 0.370437-0.23843 0.555655-0.356111l121.31295 72.890101c4.840238 2.889817 10.308787 4.397147 15.84078 4.397147 5.529947 0 10.997472-1.50733 15.838733-4.397147l121.314996-72.891124c0.186242 0.118704 0.367367 0.242524 0.557702 0.357134l309.352627 181.435259C952.219163 773.930571 891.884007 831.417867 818.97651 831.417867z" p-id="6683" fill="#ffffff"></path></svg>
                <!--              <span class="tooltip-social">邮箱</span>-->
              </a>
              <span>邮箱</span>
            </div>
            <div class="item-des">{{ userInfo.email }}</div>
          </div>
          <div class="media-item">
            <div class="item-title">
              <a href="#">
                <svg t="1715352242009" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9524" ><path d="M800 832a32 32 0 0 0 32-32V480a32 32 0 0 0-32-32H224a32 32 0 0 0-32 32v320a32 32 0 0 0 32 32z m0 64H224a96 96 0 0 1-96-96V480a96 96 0 0 1 96-96h576a96 96 0 0 1 96 96v320a96 96 0 0 1-96 96z" p-id="9525" fill="#ffffff"></path><path d="M480 576a32 32 0 0 1 64 0v128a32 32 0 0 1-64 0zM352 416a32 32 0 0 1-64 0v-96a224 224 0 0 1 448 0v96a32 32 0 0 1-64 0v-96a160 160 0 0 0-320 0z" p-id="9526" fill="#ffffff"></path></svg>
                <!--              <span class="tooltip-social">是否设置密码</span>-->
              </a>
              <span>是否设置密码</span>
            </div>
            <div class="item-des">{{ userInfo.hasPassword }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-page-content log-out" @click="handleLogOut" style="height: 3rem">
      退出登录
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserCard',
  mounted () {
    // console.log('userInfo', this.userInfo)
  },
  computed: {
    ...mapGetters('sidebar', ['isSmallScreen', 'isWideScreen', 'isMediumScreen']),
    ...mapGetters('auth', ['user', 'mode', 'isGuest']),
    userInfo () {
      return {
        accountId: this.isGuest ? '游客访问' : (this.user.accountId || '未设置'),
        username: this.isGuest ? '游客访问' : (this.user.username || '未设置'),
        email: this.isGuest ? '游客访问' : (this.user.email || '未设置'),
        hasPassword: this.isGuest ? '游客访问' : (this.user.hasPassword ? '已设置' : '未设置'),
        mode: this.mode === 'user' ? '用户身份' : '商家身份'
      }
    },
    cardStyles () {
      const style = {
        // width: '35rem'
        // height: '50%'
      }
      if (this.isSmallScreen) {
        style.width = '30rem'
      } else if (this.isMediumScreen) {
        style.width = '30rem'
        // style.height = ''
      } else if (this.isWideScreen) {
        style.width = '35rem'
        // style.height = ''
      }

      return style
    }
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
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.profile-page-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $primary-color;
  border-radius: 1rem;
  flex-direction: column;
  height: 3rem;
  color: #2cb5a0;
  font-size: 120%;
  font-weight: bold;
  margin: 1rem 0 0 0;
}
.log-out {
  cursor: pointer;
  &:hover {
    background-color: $light-gray;
  }
}

.media-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .item-title {
    display: flex;
    flex-direction: row;
  }

  .item-des {
    flex:1;
    display: flex;
    justify-content: end;
  }
}
.card-client {
  background: #2cb5a0;
  width: 13rem;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 20px;
  padding-right: 20px;
  border: 4px solid #7cdacc;
  box-shadow: 0 6px 10px rgba(207, 212, 222, 1);
  border-radius: 10px;
  text-align: center;
  color: #fff;
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
}

.card-client:hover {
  transform: translateY(-10px);
}

.user-picture {
  overflow: hidden;
  object-fit: cover;
  width: 5rem;
  height: 5rem;
  border: 4px solid #7cdacc;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.user-picture svg {
  width: 2.5rem;
  fill: currentColor;
}

.name-client {
  margin: 0;
  margin-top: 20px;
  font-weight: 600;
  font-size: 18px;
}

.name-client span {
  display: block;
  font-weight: 200;
  font-size: 16px;
}

.social-media:before {
  content: " ";
  display: block;
  width: 100%;
  height: 2px;
  margin: 20px 0;
  background: #7cdacc;
}

.social-media a {
  position: relative;
  margin-right: 15px;
  text-decoration: none;
  color: inherit;
}

.social-media a:last-child {
  margin-right: 0;
}

.social-media a svg {
  width: 1.1rem;
  fill: currentColor;
}

/*-- Tooltip Social Media --*/
.tooltip-social {
  background: #262626;
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 0.5rem 0.4rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -90%);
  transition: all 0.2s ease;
  z-index: 1;
}

.tooltip-social:after {
  content: " ";
  position: absolute;
  bottom: 1px;
  left: 50%;
  border: solid;
  border-width: 10px 10px 0 10px;
  border-color: transparent;
  transform: translate(-50%, 100%);
}

.social-media a .tooltip-social:after {
  border-top-color: #262626;
}

.social-media a:hover .tooltip-social {
  opacity: 1;
  transform: translate(-50%, -130%);
}
</style>
