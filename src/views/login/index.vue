<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="top"
      :hide-required-asterisk="true"
    >
      <div class="title-container">
        <h3 class="title">Tech Panda</h3>
      </div>

      <el-form-item prop="username" label="用户名">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入登陆密码"
          name="password"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye-close-pwd' : 'eye'"
          />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit-btn"
          type="primary"
          :loading="loading"
          @click.native.prevent="handleLogin"
          >登陆</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      otherQuery: {},
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true,
    },
  },
  methods: {
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery,
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$cursor: $--color-text-primary;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    input {
      background: transparent;
      -webkit-appearance: none;
      caret-color: $cursor;
      &:-webkit-autofill {
        color: $cursor !important;
        box-shadow: 0 0 0px 1000px $--color-white inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: #f0f2f5 url(../../assets/images/login-bg.svg) no-repeat center
    110px / 100% 100%;

  .login-form {
    position: relative;
    width: 320px;
    max-width: 100%;
    padding: 160px 0 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 28px;
      color: #303133;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: $--icon-color-base;
    cursor: pointer;
    user-select: none;
  }
  .submit-btn {
    margin-top: 16px;
    width: 100%;
  }
}
</style>
