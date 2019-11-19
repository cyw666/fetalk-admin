<template>
  <div class="introduction">
    <page-header>
      <span>&nbsp;</span>
      <template v-slot:right>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </template>
    </page-header>
    <page-container v-adaptive-table="{ bottomOffset: 10 }">
      <el-form
        :model="formData"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        :hide-required-asterisk="true"
        class="aboutForm"
      >
        <el-form-item label="电话" prop="tel">
          <el-input v-model="formData.tel" placeholder="请填写电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请填写邮箱" />
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="formData.wechat" placeholder="请填写微信号" />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <editor
            ref="introductionRichText"
            v-model="formData.introduction.html"
            :height="260"
          />
        </el-form-item>
      </el-form>
    </page-container>
  </div>
</template>

<script>
import _ from 'lodash'
// import { getAbout, setAbout } from '@/services/about'
import { validPhone, validTel, validEmail } from '@/utils/validate'
export default {
  name: 'Introduction',
  data() {
    const validateTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系电话'))
      }
      if (!validPhone(value) && !validTel(value)) {
        callback(new Error('电话格式有误'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱'))
      }
      if (!validEmail(value)) {
        callback(new Error('邮箱格式有误'))
      } else {
        callback()
      }
    }
    return {
      htmlContent: '',
      formData: {
        tel: '',
        email: '',
        wechat: '',
        introduction: {
          html: '',
          text: '',
        },
      },
      aboutId: '',
      rules: {
        tel: [{ validator: validateTel, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        wechat: [{ required: true, message: '请输入微信号', trigger: 'blur' }],
        introduction: [
          { required: true, message: '请输入简介内容', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    introductionRichText() {
      return this.$refs.introductionRichText
    },
  },
  created() {
    this.getAbout()
  },
  methods: {
    async getAbout() {
      try {
        // const data = await getAbout()
        // this.aboutId = data.id
        // _.assign(this.formData, _.pick(data, _.keys(this.formData)))
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async save() {
      const text = this.introductionRichText.getText()
      this.formData.introduction.text = text
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.setAbout()
        } else {
          return false
        }
      })
    },
    async setAbout() {
      try {
        // await setAbout(this.aboutId, this.formData)
        this.$message.success('设置成功')
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.aboutForm {
  margin: auto;
  padding: 10px;
}
</style>
