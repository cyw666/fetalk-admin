<template>
  <div class="shop-categories">
    <page-header>
      <span>&nbsp;</span>
      <template v-slot:right>
        <el-button type="primary" @click="openDialog(0)">新增</el-button>
      </template>
    </page-header>
    <page-container>
      <el-table
        v-loading="listLoading"
        v-adaptive-table="{ bottomOffset: 10 }"
        :data="list"
        element-loading-text="Loading"
        height="450"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80"
        ></el-table-column>
        <el-table-column label="分类名称" min-width="130">
          <template slot-scope="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column label="分类图标" min-width="120" align="center">
          <template slot-scope="{ row }">
            <el-image
              style="width: 50px; height: 50px"
              :src="row.icon.url"
              fit="fill"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column min-width="150" label="创建时间" align="center">
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
              @click="openDialog(1, row)"
              size="mini"
              type="primary"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              @click="deleteClick(row.id)"
              size="mini"
              type="danger"
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
        :model="formData"
        :rules="rules"
        ref="shopCategoriesForm"
        label-width="80px"
      >
        <el-form-item prop="name" label="分类名称">
          <el-input
            v-model="formData.name"
            type="input"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item prop="url" label="分类图标">
          <single-upload
            v-model="formData.url"
            @on-success="uploadSuccess"
            fit="fill"
            style="width: 75px; height: 75px"
          ></single-upload>
        </el-form-item>
      </el-form>
    </confirm-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  getShopCategories,
  addShopCategories,
  updateShopCategories,
  deleteShopCategories,
} from '@/api/shop-categories'
const defautFormData = {
  name: '',
  icon: {},
  url: '',
}
export default {
  name: 'ShopCategories',
  data() {
    return {
      list: [],
      listLoading: true,
      showDialog: false,
      dialogType: 0, //0新增1编辑
      editRow: {},
      formData: { ...defautFormData },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        url: [{ required: true, message: '请上传分类图标', trigger: 'change' }],
      },
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogType === 0 ? '新增商铺分类' : '编辑商铺分类'
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData(options) {
      this.listLoading = true
      var params = _.assign({}, options)
      try {
        const data = await getShopCategories(params)
        this.list = data
        this.listLoading = false
      } catch (error) {
        console.warn(error)
      }
    },
    paginationChanges(options) {
      this.getData(options)
    },
    async deleteClick(id) {
      try {
        await this.$confirm('此操作将删除此分类, 是否继续?', '提示', {
          type: 'warning',
        })
        deleteShopCategories(id)
          .then(() => {
            this.$message.success('删除成功')
            this.getData()
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      } catch (error) {}
    },
    openDialog(type, item) {
      this.showDialog = true
      this.dialogType = type
      if (type !== 0) {
        this.editRow = { ...item }
        _.assign(this.formData, _.pick(item, _.keys(this.formData)), {
          url: item.icon.url,
        })
      }
    },
    resetForm() {
      this.showDialog = false
      this.formData = { ...defautFormData }
      this.$refs['shopCategoriesForm'].resetFields()
    },
    cancleAction() {
      this.resetForm()
    },
    submitForm() {
      this.$refs['shopCategoriesForm'].validate((valid, props) => {
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
          await addShopCategories(this.formData)
          message = '新增成功'
        } else {
          const id = this.editRow.id
          await updateShopCategories(id, this.formData)
          message = '修改成功'
        }
        this.resetForm()
        this.getData()
        this.$message.success(message)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    uploadSuccess(res) {
      this.formData.icon = res
    },
  },
}
</script>
