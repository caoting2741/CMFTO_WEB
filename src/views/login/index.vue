<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <!-- 使用CSS背景图片代替，不需要img标签 -->
        <img :src="require('@/assets/images/login-bgL.png')" alt="登录背景" class="login-left-image" />
      </div>

      <div class="login-right">
        <div class="login-header">
          <img src="~@/assets/images/login-logo.png" class="logo" alt="CFMOTO Logo" />
          <h3 class="welcome-title">欢迎登录</h3>
        </div>

        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
          label-position="left">
          <div class="form-item-label">用户名</div>
          <el-form-item prop="username">
            <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text"
              tabindex="1" auto-complete="on" />
          </el-form-item>

          <div class="form-item-label">登录密码</div>
          <el-form-item prop="password">
            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
              placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
            <span class="show-pwd" @click="showPwd">
              <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-hide'"></i>
            </span>
          </el-form-item>

          <div class="remember-container">
            <el-checkbox v-model="rememberMe" class="remember-me">
              <span>记住密码</span>
            </el-checkbox>
            <!-- <el-checkbox v-model="rememberPwd" class="remember-pwd">
              <span>记住密码</span>
            </el-checkbox> -->
          </div>

          <div class="captcha-container">
            <slide-verify ref="slideVerify" @success="verifySuccess" />
          </div>

          <el-button :loading="loading" type="primary" class="login-button"
            @click.native.prevent="handleLogin" :disabled="!isVerified">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SlideVerify from '@/components/SlideVerify'

// import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  components: {
    SlideVerify
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      rememberMe: false,
      rememberPwd: false,
      showCaptcha: false,
      isVerified: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    verifySuccess() {
      this.isVerified = true
      this.$message.success('验证成功')
    },
    handleLogin() {
      if (!this.isVerified) {
        this.$message.warning('请先完成滑动验证')
        return
      }
      
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((error) => {
              this.$message.error(error.message || '登录失败')
              this.loading = false
              this.isVerified = false
              // 重置验证码
              this.$nextTick(() => {
                this.$refs.slideVerify && this.$refs.slideVerify.reset()
              })
            })
        } else {
          console.log('表单校验失败')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 添加背景色作为图片的备用方案 */
  //background-color: #0b748b;
  background-image: url('~@/assets/images/login-bg.png');
  background-size: cover;
  background-position: center;
}

.login-content {
  display: flex;
  width: 1000px;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-left {
  flex: 1.8;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  //background-image: url('~@/assets/images/login-bgL.png');
  background-size: cover;
  background-position: center;
  
  .login-left-image {
    width: 80%;
    height: auto;
    object-fit: contain;
  }
}

.login-right {
  flex: 1;
  background-color: #fff;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  .logo {
    height: 40px;
    margin-bottom: 20px;
  }

  .welcome-title {
    font-size: 32px;
    color: #333;
    font-weight: 700;
    margin: 0;
  }
}

.login-form {
  flex: 1;

  .form-item-label {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 500;
    
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input {
    height: 40px;

    ::v-deep input {
      height: 40px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0 15px;

      &:focus {
        border-color: #0b748b;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}

.remember-container {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;

  .remember-me {
    //margin-right: 20px;
  }

  ::v-deep .el-checkbox__label {
    color: #333;
    font-size: 14px;
  }

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0b748b;
    border-color: #0b748b;
  }
}

.captcha-container {
  margin-bottom: 20px;
  width: 100%;
}

.login-button {
  width: 100%;
  height: 40px;
  background-color: #0b748b;
  border-color: #0b748b;
  margin-top: 10px;

  &:hover,
  &:focus {
    background-color: rgba(11, 116, 139, 0.9);
    border-color: rgba(11, 116, 139, 0.9);
  }
}

@media (max-width: 1000px) {
  .login-content {
    width: 90%;
    height: auto;
    flex-direction: column;
  }

  .login-left {
    display: none;
  }

  .login-right {
    padding: 30px 20px;
  }
}
</style>

<style lang="scss">
/* 这里添加全局样式 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
}

#app {
  height: 100%;
}
</style>