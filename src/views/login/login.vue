<template>
  <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form" auto-complete="off">
    <div class="title-container">
      <h3 class="title">登录</h3>
    </div>
    <el-form-item prop="phone">
      <span class="svg-container">
        <svg-icon icon-class="user" />
      </span>
      <el-input ref="phone" v-model="loginForm.phone" placeholder="手机号" name="phone" type="text" tabindex="1" />
    </el-form-item>

    <el-form-item prop="password">
      <span class="svg-container">
        <svg-icon icon-class="security" />
      </span>
      <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password" show-password tabindex="2" @keyup.enter.native="handleLogin" />
    </el-form-item>
    <el-form-item prop="code">
      <div style="display: flex; align-items: center">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input ref="code" v-model="loginForm.code" placeholder="验证码" name="code" tabindex="2" @keyup.enter.native="handleLogin" />
        <img class="img" :src="baseUrl + '/captcha?type=login&' + time" alt="" @click="changeImg" />
      </div>
    </el-form-item>
    <el-form-item prop="check">
      <el-checkbox v-model="loginForm.check">我已阅读并同意<span class="check">用户协议</span>和<span class="check">隐私条款</span></el-checkbox>
    </el-form-item>

    <button :class="{ loading: loading, 'btn-disabled': loading }" class="btn btn-primary" style="width: 100%; margin-bottom: 30px" @click.prevent="handleLogin">登录</button>
  </el-form>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const check = (rule, value, callback) => {
      console.log(rule, value, callback)
      if (!value) {
        return callback('请勾选阅读并同意用户协议和隐私条款')
      } else {
        callback()
      }
    }
    return {
      time: new Date().getTime(),
      baseUrl: import.meta.env.VITE_APP_BASE_API,
      loginForm: {
        phone: '18511111111',
        password: '12345678',
        code: '',
        check: '',
      },
      rules: {
        phone: [
          { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '请输入正确的手机号', trigger: ['change', 'blur'] },
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        password: [
          { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: ['change', 'blur'] },
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请验证码', trigger: 'blur' },
          { pattern: /^\d{4}$/, message: '请输入正确的验证码', trigger: ['change', 'blur'] },
        ],
        check: [{ validator: check, trigger: 'blur' }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    // 显示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录按钮提交表单
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            await this.$store.dispatch('user/login', this.loginForm)
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          } catch (error) {
            // 更新验证码
            this.changeImg()
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 刷新验证码
    changeImg() {
      this.time = new Date().getTime()
    },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #000000;
$cursor: #fff;

/* reset element-ui css */
.el-input {
  display: inline-block;
  height: 47px;
  width: 85%;
  color: #000;
  background: #f9f9f9;
  border-radius: 15px;
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
    // caret-color: $cursor;

    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px $bg inset !important;
      -webkit-text-fill-color: $cursor !important;
    }
  }
}

.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
  background: #fff;
}
</style>
<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #889aa4;
$light_gray: #000000;

.img:hover {
  cursor: pointer;
}

.login-form {
  border-radius: 24px;
  background: #fff;
  position: relative;
  width: 520px;
  max-width: 100%;
  margin: 250px 0 100px 200px;
  overflow: hidden;
  align-items: unset;
}

.svg-container {
  padding: 6px 5px 6px 15px;
  color: #000;
  vertical-align: middle;
  width: 30px;
  line-height: 1;
  display: inline-table;
}

.title-container {
  position: relative;

  .title {
    font-size: 26px;
    line-height: 4;
    color: $light_gray;
    margin: 0px auto 0 auto;
    text-align: center;
    font-weight: bold;
  }
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #000;
  cursor: pointer;
  user-select: none;
}
::v-deep .el-form-item__label {
  color: #000;
}
.check {
  color: #409eff;
}
</style>
