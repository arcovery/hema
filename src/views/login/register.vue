<template>
  <el-form ref="formRules" class="login-form" :model="form" :rules="rules" label-width="100px">
    <div class="title-container">
      <h3 class="title">注册</h3>
    </div>
    <el-form-item prop="username" label="用户名">
      <el-input v-model="form.username" placeholder="用户名" type="text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="phone" label="手机号">
      <el-input v-model.number.trim="form.phone" placeholder="手机号" type="number" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="email" label="邮箱">
      <el-input v-model="form.email" type="email" placeholder="邮箱" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="avatar" label="头像">
      <upload ref="upload" v-model="form.avatar" @validateField="validate"></upload>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input v-model="form.password" placeholder="密码" type="password" autocomplete="off" show-password></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <div style="display: flex">
        <el-input ref="code" v-model.number.trim="form.code" type="number" placeholder="图形验证码" name="code" tabindex="2" @keyup.enter.native="handleLogin" />
        <img class="img" :src="baseUrl + '/captcha?type=sendsms&' + time" alt="" @click="changeImg" />
      </div>
    </el-form-item>
    <el-form-item prop="rcode" label="手机验证码">
      <div style="display: flex">
        <el-input ref="code" v-model.number.trim="form.rcode" type="number" placeholder="手机验证码" name="code" tabindex="2" @keyup.enter.native="handleLogin" />
        <button class="btn btn-primary" :class="{ loading: loading, 'btn-disabled': loading }" @click.prevent="sendsms">{{ loading ? '发送中' : '发送短信验证码' }}</button>
      </div>
    </el-form-item>
    <div class="text-center mb-2">
      <button class="btn btn-primary btn-wide" :class="{ loading: send, 'btn-disabled': send }" @click.prevent="submit">{{ send ? '注册中' : '注册' }}</button>
    </div>
  </el-form>
</template>

<script>
import { registerAPI, sendSmsAPI } from '@/api/login'
import upload from '@/components/upload/index.vue'
export default {
  name: 'Register',
  components: {
    upload,
  },
  data() {
    return {
      loading: false,
      send: false,
      time: new Date().getTime(),
      baseUrl: import.meta.env.VITE_APP_BASE_API,
      form: {
        username: '',
        phone: '',
        email: '',
        avatar: '',
        password: '',
        rcode: '',
        code: '',
      },
      rules: {
        username: [
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: ['change', 'blur'] },
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
        phone: [
          { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '请输入正确的手机号', trigger: ['change', 'blur'] },
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        password: [
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: ['change', 'blur'] },
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change'],
          },
        ],
        avatar: [{ required: true, message: '请上传头像', trigger: 'change' }],
        rcode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{4}$/, message: '请输入正确的验证码', trigger: ['change', 'blur'] },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{4}$/, message: '请输入正确的验证码', trigger: ['change', 'blur'] },
        ],
      },
    }
  },
  methods: {
    validate() {
      this.$refs.formRules.validateField('avatar')
    },
    // 表单提交
    submit() {
      this.send = true
      this.$refs.formRules.validate(async (result) => {
        if (result) {
          const res = await registerAPI(this.form)
          if (res.code === 200) {
            this.$notify.success({
              title: '成功',
              message: '注册完成,请登录',
              duration: 1000,
              forbidClick: true,
            })
            this.$emit('login')
            this.$refs.formRules.resetFields()
            this.$refs.upload.imageUrl = ''
            this.send = false
          } else {
            this.changeImg()
            this.send = false
          }
        }
        this.send = false
      })
    },
    // 刷新验证码
    changeImg() {
      this.time = new Date().getTime()
    },

    // 发送短信验证码
    async sendsms() {
      let validator = true
      this.loading = true
      this.$refs.formRules.validateField(['phone', 'code'], (error) => {
        if (error) {
          validator = false
        }
      })
      if (validator) {
        const res = await sendSmsAPI({ code: this.form.code, phone: this.form.phone })
        if (res.code === 200) {
          this.$notify.success({
            title: '短信发送成功',
            duration: 1000,
            forbidClick: true,
          })
          this.form.rcode = res.data.captcha
        }
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
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
  border-radius: 4px;
  background: #f9f9f9;
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

::v-deep.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 5px;
  color: #454545;
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
  width: 620px;
  max-width: 100%;
  margin: 0px 150px 50px;
  overflow: hidden;
  align-items: unset;
}

.tips {
  font-size: 14px;
  color: #000;
  margin-bottom: 10px;

  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
}

.svg-container {
  padding: 6px 5px 6px 15px;
  color: #000;
  vertical-align: middle;
  width: 30px;
  line-height: 1;
  display: inline-block;
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
.btn {
  text-align: center;
  .el-button {
    width: 160px;
    margin-bottom: 10px;
  }
}
</style>
