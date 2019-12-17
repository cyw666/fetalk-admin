<template>
  <div class="main-swiper-wrapper">
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
        <el-table-column label="目标类型" width="150">
          <template slot-scope="{ row }">
            {{ getConstName(row.targetType, SWIPERTARGETTYPE) }}
          </template>
        </el-table-column>
        <el-table-column label="目标地址" min-width="150">
          <template slot-scope="{ row }">
            <span>{{ row.targetID }}</span>
          </template>
        </el-table-column>
        <el-table-column label="轮播图片" width="240" align="center">
          <template slot-scope="{ row }">
            <el-image
              style="width: 218px; height: 123px"
              :src="row.thumbnail.url"
              fit="contain"
            ></el-image>
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
      width="520px"
      @close="cancleAction"
      @confirm="submitForm"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="swiperForm"
        label-width="80px"
      >
        <el-form-item prop="targetType" label="目标类型">
          <el-select
            v-model="formData.targetType"
            placeholder="请选择目标类型"
            clearable
          >
            <el-option
              v-for="item in SWIPERTARGETTYPE"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="targetID" label="目标地址">
          <el-input
            v-model="formData.targetID"
            type="input"
            placeholder="请输入目标地址"
          />
        </el-form-item>
        <el-form-item label="轮播图片" prop="url">
          <single-upload
            v-model="formData.url"
            @on-success="uploadSuccess"
          ></single-upload>
        </el-form-item>
      </el-form>
    </confirm-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { SWIPERTARGETTYPE } from '@/utils/constants'
import {
  getSwiper,
  addSwiper,
  updateSwiper,
  deleteSwiper,
} from '@/api/main-swiper'
const defautFormData = {
  targetType: '',
  targetID: '',
  url: '',
  thumbnail: {},
}
export default {
  name: 'MainSwiper',
  data() {
    return {
      SWIPERTARGETTYPE,
      total: 0,
      list: null,
      listLoading: true,
      showDialog: false,
      dialogType: 0, //0新增1编辑2重置
      editRow: {},
      formData: { ...defautFormData },
      rules: {
        targetType: [
          { required: true, message: '请选择目标类型', trigger: 'change' },
        ],
        targetID: [
          { required: true, message: '请输入目标地址', trigger: 'blur' },
        ],
        url: [{ required: true, message: '轮播图片', trigger: 'change' }],
      },
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogType === 0 ? '新增轮播图' : '编辑轮播图'
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
        const response = await getSwiper(params)
        this.list = response
        this.listLoading = false
      } catch (error) {
        console.warn(error)
      }
    },
    async deleteClick(id) {
      try {
        await this.$confirm('此操作将删除此轮播图, 是否继续?', '提示', {
          type: 'warning',
        })
        deleteSwiper(id)
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
          url: item.thumbnail.url,
        })
      }
    },
    resetForm() {
      this.showDialog = false
      this.formData = { ...defautFormData }
      this.$refs['swiperForm'].resetFields()
    },
    cancleAction() {
      this.resetForm()
    },
    submitForm() {
      this.$refs['swiperForm'].validate((valid, props) => {
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
          await addSwiper(this.formData)
          message = '新增成功'
        } else {
          const id = this.editRow.id
          await updateSwiper(id, this.formData)
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
      this.formData.thumbnail = res
    },
  },
}
</script>
