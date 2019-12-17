<template>
  <div class="change-password">
    <page-container>
      <div class="change-password__wrapper">
        <el-form
          ref="changePassword"
          class="change-password-form"
          :model="formData"
          :rules="ruleValidate"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
              v-model="formData.oldPassword"
              type="password"
              placeholder="请输入旧密码..."
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="formData.newPassword"
              type="password"
              placeholder="请输入新密码..."
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请确认新密码..."
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('changePassword')"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </page-container>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { removeToken } from '@/utils/token'

export default {
  name: 'ChangePassword',
  data() {
    const validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else if (value.length < 6) {
        callback(new Error('至少6位字符'))
      } else {
        callback()
      }
    }
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('至少6位字符'))
      } else if (value === this.formData.oldPassword) {
        callback(new Error('新旧密码不能一致'))
      } else {
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认新密码'))
      } else if (value.length < 6) {
        callback(new Error('至少6位字符'))
      } else if (value !== this.formData.newPassword) {
        callback(new Error('确认密码错误'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      ruleValidate: {
        oldPassword: [{ validator: validateOldPass, trigger: 'blur' }],
        newPassword: [{ validator: validateNewPass, trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPass, trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),
    userId() {
      return this.userInfo.id
    },
  },
  created() {},
  methods: {
    ...mapActions({
      changePassword: 'user/changePassword',
    }),
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    async save() {
      const params = _.pick(this.formData, ['oldPassword', 'newPassword'])
      try {
        await this.changePassword({ id: this.userId, params })
        this.$message.success('修改密码成功')
        removeToken()
        this.$router.push('/login')
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.change-password {
  &__wrapper {
    height: calc(100vh - 70px);
    background: $--color-white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-form {
    width: 320px;
    margin: 0 auto;
    // padding: 50px 0;
  }
}
</style>
