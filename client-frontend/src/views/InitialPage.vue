<template>
  <div class="initial-container">
    <div class="initial-wrapper" :style="initialStyles" ref="initialWrapper">
      <div class="pre-box" ref="preBox" :style="preBoxStyles">
        <div class="pro-box-mask" v-if="isWideScreen" :style="preBoxMask"></div>
        <h1 class="pro-box-title" :style="boxTitleStyles">WELCOME</h1>
        <p class="pro-box-text" v-if="!isSmallScreen">JOIN US!</p>
        <div class="img-box" :style="imageBoxStyles">
          <img :src="preImage" alt="" id="avatar" ref="avatar" />
        </div>
      </div>
      <div class="register-form info-box"  :style="[infoBoxStyles, isWideScreen && currentPage === 'login' ? { opacity: 0 } : {}]" v-if="this.isWideScreen || this.isSmallScreen || this.currentPage === 'register' " >
        <div class="info-box-wrapper" :style="infoBoxWrapperStyles">
          <div class="info-title-content" :style="infoTitleStyles">
            <h1>{{ isUser ? '用户注册' : '商家注册' }}</h1>
          </div>
          <el-form
            v-if="!useEmailByRegister"
            class="info-from-content"
            :style="infoFromStyles"
            key="registerForm"
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-with="5px"
            :hide-required-asterisk = "true"
            :validate-on-rule-change="false"
            @submit="triggerRegister"
          >
            <el-form-item class='info-item' prop="username" label=" ">
              <el-input
                type="text"
                placeholder="用户名"
                suffix-icon="el-icon-user-solid"
                v-model="registerForm.username"
                @keydown.enter="triggerRegister"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="password" label=" ">
              <el-input
                type="password"
                placeholder="密码"
                suffix-icon="el-icon-lock"
                show-password
                v-model="registerForm.password"
                @keydown.enter="triggerRegister"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="confirmPassword" label=" ">
              <el-input
                type="password"
                placeholder="确认密码"
                suffix-icon="el-icon-lock"
                show-password
                v-model="registerForm.confirmPassword"
                @keydown.enter="triggerRegister"
              />
            </el-form-item>
          </el-form>
          <el-form
            v-else
            class="info-from-content"
            :style="infoFromStyles"
            key="registerByEmailForm"
            ref="registerByEmailFormRef"
            :model="registerByEmailForm"
            :rules="registerByEmailRules"
            label-with="5px"
            :hide-required-asterisk = "true"
            :validate-on-rule-change="false"
            @submit="triggerRegister"
          >
            <el-form-item class='info-item' prop="email" label=" ">
              <el-input
                type="email"
                placeholder="邮箱"
                suffix-icon="el-icon-message"
                v-model="registerByEmailForm.email"
                @keydown.enter="triggerRegister"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="verCode" label=" ">
              <el-input
                type="text"
                placeholder="验证码"
                v-model="registerByEmailForm.verCode"
                @keydown.enter="triggerRegister"
              >
                <el-button slot="append" @click="sendVerCode" type="text" size="small" :style="sendVerCodeStyles">
                  {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
                </el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="info-button-content">
            <div class="button-box">
              <div class="prompt-text" v-if="useEmailByRegister">使用邮箱注册将会自动登录</div>
              <button type="button" @click="triggerRegister">注册</button>
              <div class="tourist-box" >
                <p @click="handleLoginAsGuest" :style="{display: isUser ? 'block' : 'none'}">游客访问</p>
                <p @click="switchToEmail('register')">{{ useEmailByRegister ? "用户密码注册" : "邮箱注册" }}</p>
              </div>
            </div>
            <div class="switch-box">
              <p @click="mySwitch">已有账号?去登录</p>
            </div>
          </div>
        </div>
      </div>
      <div class="login-form info-box" :style="[infoBoxStyles, isWideScreen && currentPage === 'register' ? { opacity: 0 } : {}]" v-if="this.isWideScreen || this.isSmallScreen || this.currentPage === 'login' ">
        <div class="info-box-wrapper" :style="infoBoxWrapperStyles">
          <div class="info-title-content" :style="infoTitleStyles">
            <h1>{{ isUser ? '用户登录' : '商家登录'}}</h1>
          </div>
          <el-form
            v-if="!useEmailByLogin"
            id="loginForm"
            class="info-from-content"
            :style="infoFromStyles"
            key="loginForm"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-with="5px"
            :hide-required-asterisk = "true"
            :validate-on-rule-change="false"
            @submit="triggerLogin"
          >
            <el-form-item class='info-item' prop="username" label=" ">
              <el-input
                type="text"
                placeholder="用户名/UID/邮箱"
                suffix-icon="el-icon-user-solid"
                v-model="loginForm.username"
                @keydown.enter="triggerLogin"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="password" label=" ">
              <el-input
                type="password"
                placeholder="密码"
                show-password
                suffix-icon="el-icon-lock"
                v-model="loginForm.password"
                @keydown.enter="triggerLogin"
              />
            </el-form-item>
          </el-form>
          <el-form
            v-else
            id="loginForm"
            class="info-from-content"
            :style="infoFromStyles"
            key="loginByEmailForm"
            ref="loginByEmailFormRef"
            :model="loginFormByEmail"
            :rules="loginRulesByEmail"
            label-with="5px"
            :hide-required-asterisk = "true"
            :validate-on-rule-change="false"
            @submit="triggerLogin"
          >
            <el-form-item class='info-item' prop="email" label=" ">
              <el-input
                type="email"
                placeholder="邮箱"
                suffix-icon="el-icon-message"
                v-model="loginFormByEmail.email"
                @keydown.enter="triggerLogin"
              />
            </el-form-item>
            <el-form-item class='info-item' prop="verCode" label=" ">
              <el-input
                type="text"
                placeholder="验证码"
                v-model="loginFormByEmail.verCode"
                @keydown.enter="triggerLogin"
              >
                <el-button slot="append" @click="sendVerCode" type="text" size="small" :style="sendVerCodeStyles">
                  {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
                </el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="info-button-content">
            <div class="button-box">
              <div class="prompt-text" v-if="useEmailByLogin">若该邮箱未注册则自动注册</div>
              <button type="button" @click="triggerLogin">登录</button>
              <div class="tourist-box">
                <p @click="handleLoginAsGuest" :style="{display: isUser ? 'block' : 'none'}">游客访问</p>
                <p @click="switchToEmail('login')">{{ useEmailByLogin ?  "用户名密码登录" : "邮箱验证码登录" }}</p>
              </div>
            </div>
            <div class="switch-box">
              <p @click="mySwitch">没有账号?去注册</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="position: fixed; bottom: 1rem; right: 50%; transform: translateX(50%);">
      <el-switch
        style="display: block"
        v-model="isUser"
        active-color="#21B05D"
        inactive-color="#10783b"
        :active-text="flag ? '用户登录' : '用户注册'"
        :inactive-text="flag ? '商家登录' : '商家注册'">
      </el-switch>
    </div>
  </div>
</template>

<script>
// import backImg from '@/assets/initial/background.png'
import { mapGetters, mapActions } from 'vuex'
import { login as apiLogin, register, loginGuest as loginGuestApi, sendEmailCode } from '@/api/auth' // 导入API方法
// import { encryptData } from '@/utils/encryption'
export default {
  name: 'initialPage',
  data () {
    return {
      isUser: true,
      useEmailByRegister: false,
      useEmailByLogin: false,
      flag: true, // 为真则登录 为假则注册
      loginForm: {
        username: 'demo123',
        password: '12345678'
      },
      loginFormByEmail: {
        email: '',
        verCode: ''
      },
      registerForm: {
        username: '123',
        password: '123456',
        confirmPassword: '123456'
      },
      registerByEmailForm: {
        email: '',
        verCode: ''
      },
      rememberMe: false,
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 20, message: '长度应该为6-20', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '只能包含字母和数字', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
                callback(new Error('用户名必须包含字母和数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度应为8-20', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_@.]+$/, message: '只能包含字母、数字和@._', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.matchPassword, trigger: 'blur' }
        ]
      },
      registerByEmailRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        verCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
        ]
      },
      loginRules: {
        userinfo: [
          { required: true, message: '请输入用户名/UID/邮箱', trigger: 'blur' },
          { min: 6, max: 20, message: '长度应该为6-20个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '只能包含字母和数字', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.includes('@')) {
                callback(new Error('请输入有效的邮箱地址'))
                if (!value.includes('.')) { callback(new Error('请输入有效的邮箱地址')) }
                // 如果包含 '@' 符号，认为是邮箱，进行邮箱格式验证
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailPattern.test(value)) {
                  callback(new Error('请输入有效的邮箱地址'))
                } else {
                  callback()
                }
              } else {
                // 不是邮箱，无需额外格式验证
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度应为8-20', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_@.]+$/, message: '只能包含字母、数字和@._', trigger: 'blur' }
        ]
      },
      loginRulesByEmail: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        verCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
        ]
      },
      // imgWuwu: require('@/assets/img/wuwu.jpeg'),
      // imgWaoku: require('@/assets/img/waoku.jpg')
      imgLogin: 'https://via.placeholder.com/300x300?text=Login',
      imgRegister: 'https://via.placeholder.com/300x300?text=Register',
      timer: null,
      countdown: 0
    }
  },
  methods: {
    ...mapActions('auth', ['clearAuth', 'updateAuth']),
    // 发送验证码
    async sendVerCode () {
      if (this.countdown > 0) {
        return // 如果当前倒计时正在进行，则不执行任何操作
      }
      const email = !this.flag ? this.registerByEmailForm.email : this.loginFormByEmail.email
      if (!email) {
        this.$message.error('请输入邮箱')
        return
      }
      // 启动倒计时
      this.countdown = 60 // 设置倒计时秒数
      this.timer = setInterval(() => {
        this.countdown -= 1
        if (this.countdown <= 0) {
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
      this.$message.success('验证码已发送，请注意查收')
      try {
        await sendEmailCode({ email })
      } catch (error) {
        this.$message.error(error.message || '验证码发送失败')
      }
    },
    // 核验注册时的两次密码
    matchPassword (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    // 切换为邮箱登录
    switchToEmail (mod) {
      if (mod === 'login') {
        this.useEmailByLogin = !this.useEmailByLogin
      } else {
        this.useEmailByRegister = !this.useEmailByRegister
      }
    },
    // 切换登录注册
    mySwitch () {
      this.flag = !this.flag
      // 延迟一秒清空数据
      setTimeout(() => {
        this.loginForm = { username: '', password: '' }
        this.registerForm = { username: '', password: '', confirmPassword: '' }
      }, 500)
    },
    // 调用登录接口前核验表单
    triggerLogin () {
      if (!this.useEmailByLogin) {
        this.$refs.loginFormRef.validate((valid) => {
          if (valid) {
            this.handleLogin('normal')
          } else {
            console.log('表单验证失败')
          }
        })
      } else {
        this.$refs.loginByEmailFormRef.validate((valid) => {
          if (valid) {
            this.handleLogin('email')
          } else {
            console.log('验证码登录表单验证失败')
          }
        })
      }
    },
    // 调用注册接口前核验表单
    triggerRegister () {
      if (!this.useEmailByRegister) {
        this.$refs.registerFormRef.validate((valid) => {
          if (valid) {
            this.handleRegister('normal')
          } else {
            console.log('注册表单验证失败')
          }
        })
      } else {
        this.$refs.registerByEmailFormRef.validate((valid) => {
          if (valid) {
            this.handleRegister('email')
          } else {
            console.log('邮箱注册表单验证失败')
          }
        })
      }
    },
    // 登录
    async handleLogin (loginType) {
      let dataToSend = {}

      if (loginType === 'normal') {
        const { username, password } = this.loginForm
        dataToSend = { userinfo: username, password }
      } else if (loginType === 'email') {
        const { email, verCode } = this.loginFormByEmail
        dataToSend = { email, verCode }
      } else {
        this.$message.error('无效的登录方式')
        return
      }

      try {
        const response = await apiLogin({ userData: dataToSend, loginType, isMerchant: !this.isUser }) // 调用API
        const { user, token, mode } = response.data
        // 登录成功，保存用户信息到Vuex
        this.updateAuth({ user: user, token: token, mode: mode, isGuest: false })
        await this.$router.push(`/${this.isUser ? 'user' : 'merchant'}`).catch(err => {
          console.error(err)
        })
        this.$store.dispatch('cart/readCart')
        this.$message.success('登陆成功')
      } catch (error) {
        this.$message.error(error.message || '登录失败, 请稍后再试')
      }
    },
    // 游客登录
    async handleLoginAsGuest () {
      try {
        const response = await loginGuestApi()
        const { user, token, mode } = response.data
        this.updateAuth({ user: user, token: token, mode: mode, isGuest: true })
        await this.$router.push('/user').catch(err => {
          console.error(err)
        })
        this.$message.info('游客登录成功')
      } catch (error) {
        this.$message.error('游客登录失败, 请稍后再试')
        console.error('Guest login error', error)
      }
    },
    // 注册
    async handleRegister (registerType) {
      const registerData = {}

      if (registerType === 'normal') {
        // 普通注册表单数据
        const { username, password } = this.registerForm
        // if (password !== confirmPassword) {
        //   this.$message.error('密码不匹配，请重新输入')
        //   return
        // }
        registerData.username = username
        registerData.password = password
      } else if (registerType === 'email') {
        // 邮箱验证码注册表单数据
        const { email, verCode } = this.registerByEmailForm
        registerData.email = email
        registerData.verCode = verCode
      } else {
        this.$message.error('无效的注册方式')
        return
      }
      console.log(registerData)
      try {
        // const encryptedData = encryptData(registerData)

        const response = await register({ data: registerData, registerType, isMerchant: !this.isUser }) // 调用API
        this.$message.success('注册成功')

        if (registerType === 'normal') {
          this.registerForm = { username: '', password: '', confirmPassword: '' }
          setTimeout(() => {
            this.flag = !this.flag
          }, 500)
        } else if (registerType === 'email') {
          // 邮箱注册将自动登录
          this.registerByEmailForm = { email: '', verCode: '' }
          const { user, token, mode } = response.data
          this.updateAuth({ user: user, token: token, mode: mode, isGuest: false })
          await this.$router.push(`/${this.isUser ? 'user' : 'merchant'}`).catch(err => {
            console.error(err)
          })
          this.$message.success('登陆成功')
          this.$store.dispatch('cart/readCart')
        }
      } catch (error) {
        this.$message.error(error.message || '注册失败')
        console.log(error)
      }
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
        style.overflow = 'visible'
        if (this.currentPage === 'login') {
          style.left = '0%'
          // style.transform = 'translateX(0%)'
          // style.backgroundColor = '#edd4dc'
          style.backgroundColor = '#42b983'
          style.alignItems = 'start'
        } else if (this.currentPage === 'register') {
          style.left = '80%'
          // style.transform = 'translateX(400%)'
          // style.backgroundColor = '#c9e0ed'
          style.backgroundColor = '#61bc84'
          style.alignItems = 'end'
        }
      } else if (this.isSmallScreen) {
        style.overflow = 'visible'
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
        style.boxShadow = 'none'
        style.overflow = 'hidden'
        if (this.currentPage === 'login') {
          style.transform = 'translateX(0%)'
          // style.backgroundColor = '#edd4dc'
          // style.backgroundColor = '#61bc84'
          // style.background = 'linear-gradient(to left, rgba(255, 255, 255, 0.6), rgb(66, 185, 131))'
        } else if (this.currentPage === 'register') {
          style.transform = 'translateX(100%)'
          // style.backgroundColor = '#2E8B57'
          // style.backgroundColor = '#c9e0ed'
          // style.background = 'linear-gradient(to left, rgb(66, 185, 131), rgba(255, 255, 255, 0.6))'
        }
      }
      return style
    },
    preBoxMask () {
      const style = {
        left: '-50%',
        right: '-50%'
      }
      if (this.isWideScreen) {
        if (this.currentPage === 'login') {
          style.right = 0
          style.left = '-100%'
        } else {
          style.left = 0
          style.right = '-100%'
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
        newWidth = originalWidth / 3
        overflowX = 'clip'
        if (this.currentPage === 'login') {
          newHeight = originalHeight / 1.5
        } else if (this.currentPage === 'register') {
          newHeight = originalHeight / 1.2
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
          style.gap = '1.3rem'
        }
      }
      return style
    },
    infoFromStyles () {
      const style = {
        gap: '1.5rem'
      }
      if (this.isSmallScreen) {
        style.gap = '1.3rem'
        if (this.currentPage === 'login') {
          ;
        } else if (this.currentPage === 'register') {
          ;
        }
      }
      return style
    },
    boxTitleStyles () {
      const style = {
        gap: '1.5rem'
      }
      if (this.isSmallScreen) {
        style.gap = '1.3rem'
        if (this.currentPage === 'login') {
          ;
        } else if (this.currentPage === 'register') {
          ;
        }
      }
      return style
    },
    infoTitleStyles () {
      const style = {
      }
      if (this.isSmallScreen) {
        style.paddingTop = '1.3rem'
        // if (this.currentPage === 'login') {
        //   style.paddingTop = '1.3rem'
        // } else if (this.currentPage === 'register') {
        //   style.paddingTop = '1.3rem'
        // }
      } else if (this.isMediumScreen) {
        style.paddingTop = '1.5rem'
      } else {
        style.paddingTop = '1.8rem'
      }

      return style
    },
    sendVerCodeStyles () {
      const style = {
      }
      if (this.countdown > 0) {
        style.color = '#909399'
        style.cursor = 'wait'
      }
      return style
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

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
  overflow-y: scroll;

  display: flex;
  /* 渐变方向从左到右 */
  //background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
  background-image:
    linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), /* 渐变遮罩 */
    url('@/assets/initial/background.png'); /* 图片路径 */
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
  background-color: rgba(255, 255, 255, 0.5); /* 半透明白色背景 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
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
  background: white;

  .pro-box-mask {
    position: absolute;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(168,222,198,1) 14%, rgba(120,204,166,1) 31%, rgba(80,189,140,1) 41%, rgba(66,183,131,1) 50%, rgba(83,189,142,1) 58%, rgba(119,203,165,1) 66%, rgba(181,226,206,1) 85%, rgba(252,252,252,0.06) 100%);
    transition: left 0.3s, right 0.3s;
    z-index: 100;
  }

  /* 滑动盒子的标题 */
  .pro-box-title {
    z-index: 102;
    width: 200px;
    text-align: center;
    /* 文字间距 */
    letter-spacing: 5px;
    /* 禁止选中 */
    user-select: none;
    /* 文字阴影 */
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  }

  /* 滑动盒子的文字 */
  .pro-box-text {
    z-index: 102;
    width: 200px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    /* 禁止选中 */
    user-select: none;
    font-weight: bold;
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  }

  .img-box {
    z-index: 101;

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
    height: 100%;
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
  display: flex;
  justify-content: center;
  align-items: center;
  transition: padding-top 0.3s ease-in-out;

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
  justify-content: space-evenly;
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
    //flex: 1;
    //height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .prompt-text {
    color: $medium-gray;
    font-size: 70%;
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
    //
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .switch-box {
    height: 30px;
    line-height: 30px;
    /* 禁止选中 */
    color: $dark-gray;
    user-select: none;
    font-size: 14px;
    transition: color 0.2s;
  }
  .switch-box:hover {
    cursor: pointer;
    color: $darker-gray;
  }
  .tourist-box {

    width: 60%;
    font-size: 80%;
    //color: $medium-gray;
    transition: color 0.2s;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-self: center;
    color: $dark-gray;
    p {
      cursor: pointer;
      &:hover {
        color: $darker-gray;
      }
    }
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

.el-input-group__append {
  border: none;
  background-color: #fff;
  .el-button--text {
    padding: 0 0.5rem;
  }
  &:hover {
    color: black;
  }
}
</style>
