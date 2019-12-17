<template>
  <div class="user-list-wrapper">
    <page-header>
      <search-bar :forms="searchFormOptions" :submit-handler="getData" />
      <!-- <template v-slot:right>
        <el-button type="primary" @click="exportExcel">
          <i class="el-icon-download"></i>
          导出
        </el-button>
      </template> -->
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
          width="100"
        ></el-table-column>
        <el-table-column label="昵称" width="150">
          <template slot-scope="{ row }">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像">
          <template slot-scope="{ row }">
            <el-image
              style="width: 50px; height: 50px"
              :src="row.avatarUrl"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="{ row }">
            <span>{{ getConstName(row.status, USERSTATE) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150" align="center">
          <template slot-scope="{ row }">
            {{ row.createdAt | dateFormat('YYYY-MM-DD HH:mm:ss') }}
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
  </div>
</template>

<script>
import _ from 'lodash'
// import { export_json_to_excel } from '@/vendor/Export2Excel'
import { getUsers } from '@/api/user'
import { USERSTATE } from '@/utils/constants'
const typeOptionsInSearchForm = [
  {
    prop: 'keyWord',
    label: '',
    itemType: 'input',
    itemWidth: 200,
    placeholder: '请输入用户名...',
  },
]
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      USERSTATE,
      total: 0,
      list: null,
      listLoading: true,
      searchOptions: {
        keyWord: '',
        page: 1,
        perPage: 10,
      },
    }
  },
  computed: {
    searchFormOptions() {
      return typeOptionsInSearchForm
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData(options) {
      this.listLoading = true
      var params = _.assign(this.searchOptions, options)
      try {
        const response = await getUsers(params)
        this.list = response.data
        this.total = response.count
        this.listLoading = false
      } catch (error) {
        console.warn(error)
      }
    },
    paginationChanges(options) {
      this.getData(options)
    },
    //定义导出Excel表格事件
    exportExcel() {
      const tHeader = ['序号', '手机号', '姓名', '授权信息', '创建时间']
      const filterVal = ['index', 'phone', 'name', 'info', 'create_time']
      const data = this.formatJson(filterVal, this.list)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'user-list',
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return _.map(jsonData, (v, i) =>
        _.map(filterVal, j => {
          if (j === 'index') {
            return i + 1
          } else if (j === 'create_time') {
            return this.dateFormat(v[j], 'YYYY-MM-DD HH:mm:ss')
          } else {
            return v[j]
          }
        })
      )
    },
  },
}
</script>
