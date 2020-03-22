<template>
  <div class="admin-accounts">
    <page-header>
      <span>&nbsp;</span>
      <template v-slot:right>
        <el-button type="primary" @click="openDialog(0)">新增</el-button>
      </template>
    </page-header>
    <page-container>
      <!--列表-->
      <el-table
        v-adaptive-table="{ bottomOffset: 10 }"
        height="450"
        :data="userList"
      >
        <el-table-column type="index" width="80" label="序号" align="center" />
        <el-table-column prop="username" min-width="120" label="用户名" />
        <el-table-column prop="nickname" min-width="120" label="昵称" />
        <el-table-column prop="role" min-width="100" label="角色">
          <template slot-scope="{ row }">
            <span>{{ getConstName(row.role, ADMINROLE) }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200" label="创建时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createdAt | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="workTime"
          width="180"
          label="操作"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openDialog(1, row)"
            ></el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              type="danger"
              @click="openDialog(2, row)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteClick(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-container>
    <confirm-dialog
      :visible.sync="showDialog"
      :title="dialogTitle"
      width="420px"
      @close="cancleAction"
      @confirm="submitForm"
    >
      <el-form
        ref="accountForm"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item v-if="dialogType === 0" prop="username" label="用户名称">
          <el-input
            v-model="formData.username"
            type="input"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item
          v-if="dialogType === 0 || dialogType === 1"
          prop="nickname"
          label="昵称"
        >
          <el-input
            v-model="formData.nickname"
            type="input"
            placeholder="请输入昵称"
          />
        </el-form-item>
        <el-form-item
          v-if="dialogType === 0 || dialogType === 2"
          prop="password"
          label="密码"
        >
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item v-if="dialogType === 0" prop="role" label="角色">
          <el-select v-model="formData.role" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in ADMINROLE"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </confirm-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { ADMINROLE } from '@/utils/constants'
const defautFormData = {
  username: '',
  nickname: '',
  password: '',
  role: '',
}
export default {
  name: 'AdminAccounts',
  data() {
    return {
      ADMINROLE,
      showDialog: false,
      dialogType: 0, //0新增1编辑2重置
      formData: { ...defautFormData },
      editRow: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少6个字符', trigger: 'blur' },
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
    }
  },
  computed: {
    ...mapGetters({ userList: 'user/userList' }),
    dialogTitle() {
      return this.dialogType === 0
        ? '新增管理员'
        : this.dialogType === 1
        ? '编辑管理员'
        : '重置密码'
    },
  },
  created() {
    // this.getAdminUsers()
  },
  methods: {
    ...mapActions({
      getAdminUsers: 'user/getAdminUsers',
      updateAdminUsers: 'user/updateAdminUsers',
      addAdminUsers: 'user/addAdminUsers',
      deleteAdminUsers: 'user/deleteAdminUsers',
      resetPassword: 'user/resetPassword',
    }),
    async deleteClick(id) {
      try {
        await this.$confirm('此操作将删除此管理员, 是否继续?', '提示', {
          type: 'warning',
        })
        this.deleteAdminUsers(id)
          .then(() => {
            this.$message.success('删除成功')
            this.getAdminUsers()
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      } catch (error) {
        console.warn(error)
      }
    },
    openDialog(type, item) {
      this.showDialog = true
      this.dialogType = type
      if (type !== 0) {
        this.editRow = { ...item }
        _.assign(this.formData, _.pick(item, _.keys(this.formData)))
      }
    },
    resetForm() {
      this.showDialog = false
      this.formData = { ...defautFormData }
      this.$refs['accountForm'].resetFields()
    },
    cancleAction() {
      this.resetForm()
    },
    submitForm() {
      this.$refs['accountForm'].validate((valid, props) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    async save() {
      try {
        let message = '新增成功'
        if (this.dialogType === 0) {
          await this.addAdminUsers(this.formData)
          message = '新增成功'
        } else if (this.dialogType === 1) {
          const id = this.editRow.id
          await this.updateAdminUsers({
            id,
            params: { nickname: this.formData.nickname },
          })
          message = '修改成功'
        } else {
          const id = this.editRow.id
          await this.resetPassword({
            id,
            params: { password: this.formData.password },
          })
          message = '重置成功'
        }
        this.resetForm()
        this.getAdminUsers()
        this.$message.success(message)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.admin-accounts {
  padding: 10px;
}
</style>
