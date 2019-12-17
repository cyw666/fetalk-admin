<template>
  <div class="shop-list">
    <page-header>
      <search-bar :forms="searchFormOptions" :submit-handler="getData" />
      <template v-slot:right>
        <el-button type="primary" @click="openDialog(0)">新增</el-button>
      </template>
    </page-header>
    <page-container>
      <el-table
        v-loading="listLoading"
        v-adaptive-table
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
        <el-table-column
          label="商铺名称"
          prop="title"
          min-width="130"
        ></el-table-column>
        <el-table-column label="所属商圈" width="120">
          <template slot-scope="{ row }">
            <span>{{
              getConstName(row.tradeAreaID, tradeAreaList, 'id', 'title')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="地址"
          prop="address"
          min-width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          label="营业时间"
          prop="businessHours"
          min-width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="热门" width="80" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.isHot ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="免税" width="80" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.isTaxFreeShop ? '是' : '否' }}</span>
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
      <pagination
        :total="total"
        :page.sync="searchOptions.page"
        :per-page.sync="searchOptions.perPage"
        @pagination="paginationChanges"
      />
    </page-container>

    <confirm-dialog
      :visible.sync="showDialog"
      :title="dialogTitle"
      top="5vh"
      width="620px"
      @close="cancleAction"
      @confirm="submitForm"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="shopsForm"
        label-width="80px"
      >
        <el-form-item prop="tradeAreaID" label="所属商圈">
          <el-select
            v-model="formData.tradeAreaID"
            placeholder="请选择所属商圈"
            clearable
          >
            <el-option
              v-for="item in tradeAreaList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="商铺名称">
          <el-input v-model="formData.title" placeholder="请输入商铺名称" />
        </el-form-item>
        <el-form-item prop="covers" label="封面">
          <multiple-upload
            v-model="formData.covers"
            @on-success="uploadSuccess"
          ></multiple-upload>
        </el-form-item>
        <el-form-item prop="categoryIDList" label="商铺分类">
          <el-select
            v-model="formData.categoryIDList"
            placeholder="请选择商铺分类"
            clearable
            multiple
            collapse-tags
            filterable
          >
            <el-option
              v-for="item in shopCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="address" label="商铺地址">
          <el-input v-model="formData.address" placeholder="请输入商铺地址" />
        </el-form-item>
        <el-form-item prop="description" label="商铺描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="请输入商铺描述"
          />
        </el-form-item>
        <el-form-item prop="businessHours" label="营业时间">
          <el-input
            v-model="formData.businessHours"
            placeholder="请输入营业时间"
          />
        </el-form-item>
        <el-form-item prop="isTaxFreeShop" label="是否免税">
          <el-switch v-model="formData.isTaxFreeShop"> </el-switch>
        </el-form-item>
        <el-form-item prop="isHot" label="热门商圈">
          <el-switch v-model="formData.isHot"> </el-switch>
        </el-form-item>
      </el-form>
    </confirm-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { getShops, addShops, updateShops, deleteShops } from '@/api/shop-list'
import { getShopCategories } from '@/api/shop-categories'
import { getTradeAreas } from '@/api/trade-areas'
import { HOTLIST } from '@/utils/constants'

const defautFormData = {
  tradeAreaID: '',
  title: '',
  covers: [],
  categoryIDList: [],
  address: '',
  description: '',
  businessHours: '',
  isTaxFreeShop: false,
  isHot: false,
}

export default {
  name: 'Shops',
  data() {
    return {
      tradeAreaOptions: {
        prop: 'tradeAreaID',
        label: '所属商圈',
        itemType: 'select',
        valueKey: 'id',
        labelKey: 'title',
        itemWidth: 140,
        placeholder: '请选择所属商圈',
        options: [],
      },
      categoryOptions: {
        prop: 'categoryID',
        label: '商铺分类',
        itemType: 'select',
        valueKey: 'id',
        labelKey: 'title',
        itemWidth: 140,
        placeholder: '请选择商铺分类',
        options: [],
      },
      hotOptions: {
        prop: 'isHot',
        label: '热门',
        itemType: 'select',
        itemWidth: 140,
        labelWidth: '70',
        placeholder: '请选择热门',
        options: HOTLIST,
      },
      titleOptions: {
        prop: 'title',
        label: '',
        itemType: 'input',
        itemWidth: 180,
        placeholder: '请输入商铺名称...',
      },
      HOTLIST,
      searchOptions: {
        page: 1,
        perPage: 10,
        tradeAreaID: '',
        title: '',
        categoryID: '',
        isHot: '',
      },
      total: 0,
      tradeAreaList: [],
      shopCategories: [],
      list: [],
      listLoading: true,
      showDialog: false,
      dialogType: 0, //0新增1编辑
      editRowID: '',
      formData: { ...defautFormData },
      rules: {
        tradeAreaID: [
          { required: true, message: '请选择所属商圈', trigger: 'change' },
        ],
        title: [{ required: true, message: '请输入商铺名称', trigger: 'blur' }],
        covers: [{ required: true, message: '请上传封面', trigger: 'change' }],
        categoryIDList: [
          { required: true, message: '请选择商铺分类', trigger: 'change' },
        ],
        isTaxFreeShop: [{ required: true, message: '', trigger: 'change' }],
        isHot: [{ required: true, message: '', trigger: 'change' }],
      },
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogType === 0 ? '新增商铺' : '编辑商铺'
    },
    searchFormOptions() {
      return [
        this.tradeAreaOptions,
        this.categoryOptions,
        this.hotOptions,
        this.titleOptions,
      ]
    },
  },
  created() {
    this.getData()
    this.getTradeAreas()
    this.getShopCategories()
  },
  methods: {
    async getTradeAreas() {
      var params = { withoutPagination: true }
      try {
        const data = await getTradeAreas(params)
        this.tradeAreaList = data
        this.tradeAreaOptions.options = data
        this.categoryOptions.options = data
      } catch (error) {
        console.warn(error)
      }
    },
    async getShopCategories() {
      try {
        const data = await getShopCategories()
        this.shopCategories = data
      } catch (error) {
        console.warn(error)
      }
    },
    async getData(options) {
      this.listLoading = true
      var params = _.assign(this.searchOptions, options)
      try {
        const { data, count } = await getShops(params)
        this.list = data
        this.total = count
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
        await this.$confirm('此操作将删除此商铺, 是否继续?', '提示', {
          type: 'warning',
        })
        deleteShops(id)
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
        this.editRowID = item.id
        _.assign(this.formData, _.pick(item, _.keys(this.formData)))
      }
    },
    resetForm() {
      this.showDialog = false
      this.formData = { ...defautFormData }
      this.$refs['shopsForm'].resetFields()
    },
    cancleAction() {
      this.resetForm()
    },
    submitForm() {
      this.$refs['shopsForm'].validate((valid, props) => {
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
          await addShops(this.formData)
          message = '新增成功'
        } else {
          await updateShops(this.editRowID, this.formData)
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
