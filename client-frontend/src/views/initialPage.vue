<template>
  <div class="initial-container">
    <div class="initial-wrapper" :style="initialStyles" ref="initialWrapper">
      <div class="pre-box" ref="preBox" :style="preBoxStyles">
        <h1 class="pro-box-title">WELCOME</h1>
        <p class="pro-box-text" v-if="!isSmallScreen">JOIN US!</p>
        <div class="img-box" :style="imageBoxStyles">
          <img :src="preImage" alt="" id="avatar" ref="avatar" />
        </div>
      </div>
      <div class="register-form info-box"  :style="infoBoxStyles" v-if="this.isWideScreen || this.isSmallScreen || this.currentPage === 'register' " >
        <div class="info-box-wrapper" :style="infoBoxWrapperStyles">
          <div class="info-title-content">
            <h1>注册</h1>
          </div>
          <el-form
            class="info-from-content"
            :style="infoFromStyles"
            ref="registerFormRef"
            :model="registerForm"
            :rules="rulesRegister"
            label-with="5px"
            :hide-required-asterisk = "true"
          >
            <el-form-item class='info-item' prop="username" label=" ">
              <el-input
                type="text"
                placeholder="用户名"
                suffix-icon="el-icon-user-solid"
                v-model="registerForm.username"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="password" label=" ">
              <el-input
                type="password"
                placeholder="密码"
                suffix-icon="el-icon-lock"
                v-model="registerForm.password"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="confirmPassword" label=" ">
              <el-input
                type="password"
                placeholder="确认密码"
                suffix-icon="el-icon-lock"
                v-model="registerForm.confirmPassword"
              />
            </el-form-item>
          </el-form>
          <div class="info-button-content">
            <div class="button-box">
              <button @click="register">注册</button>
            </div>
            <div class="switch-box">
              <p @click="mySwitch">已有账号?去登录</p>
            </div>
          </div>
        </div>
      </div>
      <div class="login-form info-box" :style="infoBoxStyles" v-if="this.isWideScreen || this.isSmallScreen || this.currentPage === 'login' ">
        <div class="info-box-wrapper" :style="infoBoxWrapperStyles">
          <div class="info-title-content">
            <h1>登录</h1>
          </div>
          <el-form
            class="info-from-content"
            :style="infoFromStyles"
            ref="loginFormRef"
            :model="loginForm"
            :rules="rulesLogin"
            label-with="5px"
            :hide-required-asterisk = "true"
          >
            <el-form-item class='info-item' prop="username" label=" ">
              <el-input
                type="text"
                placeholder="用户名"
                suffix-icon="el-icon-user-solid"
                v-model="loginForm.username"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="password" label=" ">
              <el-input
                type="password"
                placeholder="密码"
                suffix-icon="el-icon-lock"
                v-model="loginForm.password"
              />
            </el-form-item>
          </el-form>
          <div class="info-button-content">
            <div class="button-box">
              <button @click="login">登录</button>
            </div>
            <div class="switch-box">
              <p @click="mySwitch">已有账号?去登录</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import backImg from '@/assets/initial/background.png'
import { mapGetters } from 'vuex'

export default {
  name: 'initialPage',
  data () {
    return {
      flag: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rulesRegister: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度应该在3~5个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度应该大于6', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, message: '长度应该大于6', trigger: 'blur' }
        ]
      },
      rulesLogin: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      // imgWuwu: require('@/assets/img/wuwu.jpeg'),
      // imgWaoku: require('@/assets/img/waoku.jpg')
      imgLogin: 'https://via.placeholder.com/300x300?text=Login',
      imgRegister: 'https://via.placeholder.com/300x300?text=Register'
    }
  },
  methods: {
    register () {

    },
    login () {

    },
    mySwitch () {
      this.flag = !this.flag
    }
  },
  computed: {
    preImage () {
      return this.currentPage === 'register' ? this.imgRegister : this.imgLogin
    },
    currentPage () {
      return this.flag ? 'login' : 'register'
    },

    preBoxStyles () {
      const style = {}
      // 小屏
      if (this.isMediumScreen) {
        style.width = '20%'
        if (this.currentPage === 'login') {
          style.left = '0%'
          // style.transform = 'translateX(0%)'
          style.backgroundColor = '#edd4dc'
          style.alignItems = 'start'
        } else if (this.currentPage === 'register') {
          style.left = '80%'
          // style.transform = 'translateX(400%)'
          style.backgroundColor = '#c9e0ed'
          style.alignItems = 'end'
        }
      } else if (this.isSmallScreen) {
        // style.opacity = '0'
        // style.display = 'none'
        style.width = '100%'
        style.height = '20%'
        style.transform = 'translateY(-50%)'
        style.backgroundColor = 'transparent'
        style.gap = 0
        style.boxShadow = 'none'
      } else {
        style.width = '50%'
        if (this.currentPage === 'login') {
          style.transform = 'translateX(0%)'
          style.backgroundColor = '#edd4dc'
        } else if (this.currentPage === 'register') {
          style.transform = 'translateX(100%)'
          style.backgroundColor = '#c9e0ed'
        }
      }
      return style
    },
    imageBoxStyles () {
      const style = {}
      if (this.isSmallScreen) {
        style.position = 'absolute'
        style.width = '80px'
        style.height = '80px'
        style.transform = 'translateY(-50%)'
      } else if (this.isMediumScreen) {
        // style.position = 'absolute'
      } else {
        style.width = '200px'
        style.height = '200px'
      }
      return style
    },
    ...mapGetters('sidebar', ['isSmallScreen', 'isMediumScreen', 'isWideScreen']),
    initialStyles () {
      const originalWidth = 65
      const originalHeight = 37
      let newWidth = 0
      let newHeight = 0
      let overflowX = 'visible'

      if (this.isMediumScreen) {
        newWidth = originalWidth / 2
        newHeight = originalHeight / 1.5
      } else if (this.isSmallScreen) {
        newWidth = originalWidth / 4
        overflowX = 'clip'
        if (this.currentPage === 'login') {
          newHeight = originalHeight / 2
        } else if (this.currentPage === 'register') {
          newHeight = originalHeight / 1.8
        }
      } else {
        newWidth = originalWidth
        newHeight = originalHeight
        if (this.currentPage === 'register') {
          ;
        } else if (this.currentPage === 'login') {
          ;
        }
      }
      return {
        width: `${newWidth}rem`,
        height: `${newHeight}rem`,
        overflowX: overflowX
      }
    },
    infoBoxStyles () {
      const style = {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        opacity: '1'
      }
      if (this.isWideScreen) {
        ;
      } else if (this.isMediumScreen) {
        if (this.currentPage === 'login') {
          style.paddingLeft = '12rem'
          style.opactiy = '0'
        } else if (this.currentPage === 'register') {
          style.paddingRight = '12rem'
          style.opactiy = '0'
        }
      } else {
        style.paddingRight = '1rem'
        style.paddingLeft = '1rem'
        style.minWidth = '100%'
        if (this.currentPage === 'login') {
          ;
          // 设置style的transform: translateX(-100%);
          style.transform = 'translateX(-100%)'
        } else if (this.currentPage === 'register') {
          style.transform = 'translateX(0%)'
        }
      }
      return style
    },
    infoBoxWrapperStyles () {
      const style = {
        gap: '2rem'
      }
      if (this.isSmallScreen) {
        if (this.currentPage === 'login') {
          ;
        } else if (this.currentPage === 'register') {
          style.gap = '1rem'
        }
      }
      return style
    },
    infoFromStyles () {
      const style = {
        gap: '1.5rem'
      }
      if (this.isSmallScreen) {
        style.gap = '1rem'
        if (this.currentPage === 'login') {
          ;
        } else if (this.currentPage === 'register') {
          ;
        }
      }
      return style
    }
  },
  created () {
    if (this.isSmallScreen) {
      console.log('small')
    } else if (this.isMediumScreen) {
      console.log('medium')
    } else if (this.isWideScreen) {
      console.log('wide')
    }
  },

  mounted () {
    if (this.isSmallScreen) {
      console.log('small')
    } else if (this.isMediumScreen) {
      console.log('medium')
    } else if (this.isWideScreen) {
      console.log('wide')
    }
  },
  watch: {
    // 使用 watch 监听 isSmallScreen 的变化
    isSmallScreen (newValue) {
      console.log(newValue ? 'small' : '')
    },
    // 使用 watch 监听 isMediumScreen 的变化
    isMediumScreen (newValue) {
      console.log(newValue ? 'medium' : '')
    },
    // 使用 watch 监听 isWideScreen 的变化
    isWideScreen (newValue) {
      console.log(newValue ? 'wide' : '')
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0;
}
  /* 去除input的轮廓 */
input {
  outline: none;
}

.initial-container {
  /* 溢出隐藏 */
  height: 100vh;
  overflow-x: hidden;
  display: flex;
  /* 渐变方向从左到右 */
  background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
}

/* 最外层的大盒子 */
.initial-wrapper {
  //width: 1050px;
  height: 600px;
  display: flex;
  /* 相对定位 */
  position: relative;
  z-index: 2;
  margin: auto;
  /* 设置圆角 */
  border-radius: 8px;
  /* 设置边框 */
  border: 1px solid rgba(255, 255, 255, 0.6);
  /* 设置盒子阴影 */
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease-in-out, height 0.3s ease-in-out;
}

/* 滑动的盒子 */
.pre-box {
  user-select: none;
  width: 50%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  border-radius: 4px;
  //background-color: #edd4dc;
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
  transition:  all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 1;
  /* 滑动盒子的标题 */
  .pro-box-title {
    z-index: 100;
    width: 200px;
    text-align: center;
    /* 文字间距 */
    letter-spacing: 5px;
    color: white;
    /* 禁止选中 */
    user-select: none;
    /* 文字阴影 */
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  }

  /* 滑动盒子的文字 */
  .pro-box-text {
    width: 200px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    /* 禁止选中 */
    user-select: none;
    font-weight: bold;
    color: white;
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  }

  .img-box {
    width: 200px;
    height: 200px;
    //margin: 20px auto;
    /* 设置为圆形 */
    border-radius: 50%;
    /* 设置用户禁止选中 */
    user-select: none;
    overflow: hidden;
    box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      transition: 0.5s;
    }
  }
}

/* 登录和注册盒子 */
.info-box {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: padding-left 0.3s ease, padding-right 0.3s ease, opacity 0.3s ease, transform 0.3s;
  //padding: 1rem;
  .info-box-wrapper {
    flex: 1;
    gap: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .info-title-content,
  .info-from-content,
  .info-button-content{
    flex: 1;
  }
}

/* 标题盒子 */
.info-title-content {
  //height: 300px;
  //line-height: 500px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: end;

  h1 {
    font-size: 130%;
    /* 禁止选中 */
    user-select: none;
    letter-spacing: 5px;
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  }

}

/* 输入框盒子 */
.info-from-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  .info-item {
    width: 65%;
    //display: flex;
    //justify-content: center;
    //align-items: center;

  }
}

/* 按钮盒子 */
.info-button-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .button-box {
    flex: 1;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: start;
  }

  button {
    width: 50%;
    //height: 25%;
    margin: 0 7px;
    line-height: 30px;
    border: none;
    border-radius: 4px;
    background-color: #69b3f0;
    color: white;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .switch-box {
    height: 30px;
    line-height: 30px;
    /* 禁止选中 */
    user-select: none;
    font-size: 14px;
    color: white;
  }
  .switch-box:hover {
    cursor: pointer;
    border-bottom: 1px solid white;
  }
}

</style>

<style lang="scss">
.el-input {
  /* 输入框 */
  input {
    /* width: 60%; */
    text-indent: 10px;
    border: 0.5px solid #fff;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 0.8rem;
    /* 增加磨砂质感 */
    backdrop-filter: blur(10px);
  }

  input:focus {
    /* 光标颜色 */
    color: #b0cfe9;
  }

  /* 聚焦时隐藏文字 */
  input:focus::placeholder {
    opacity: 0;
  }
}
</style>
