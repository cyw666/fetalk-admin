<template>
  <div class="table-wrapper">
    <page-header>
      <search-bar :forms="searchFormOptions" :submit-handler="getData" />
      <template v-slot:right>
        <el-button type="primary" @click="exportExcel">
          <i class="el-icon-download"></i>
          导出
        </el-button>
      </template>
    </page-header>
    <page-container>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        v-adaptive-table
        height="450"
      >
        <el-table-column align="center" label="Index" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Title">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Author" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Pageviews" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.pageviews }}
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="Status"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          label="Display_time"
          width="200"
        >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.display_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchOptions.page"
        :perPage.sync="searchOptions.perPage"
        @pagination="paginationChanges"
      />
    </page-container>
  </div>
</template>

<script>
import _ from 'lodash'
import { export_json_to_excel } from '@/vendor/Export2Excel'
import { getList } from '@/api/table'
const typeOptionsInSearchForm = [
  {
    prop: 'role',
    label: '用户角色',
    itemType: 'select',
    itemWidth: 200,
    placeholder: '请选择用户角色',
    options: [
      {
        label: '普通用户',
        value: 'USER',
      },
      {
        label: '企业用户',
        value: 'ENTERPRISE',
      },
    ],
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
      total: 0,
      list: null,
      listLoading: true,
      searchOptions: {
        role: '',
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
        const response = await getList(params)
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      } catch (error) {
        console.warn(error)
      }
    },
    paginationChanges(options) {
      debugger
      this.getData(options)
    },
    //定义导出Excel表格事件
    exportExcel() {
      const tHeader = [
        'Index',
        'Title',
        'Author',
        'PageViews',
        'Status',
        'Display_time',
      ]
      const filterVal = [
        'index',
        'title',
        'author',
        'pageviews',
        'status',
        'display_time',
      ]
      const data = this.formatJson(filterVal, this.list)
      export_json_to_excel({
        header: tHeader,
        data,
        filename: 'user-list',
      })
    },
    formatJson(filterVal, jsonData) {
      return _.map(jsonData, (v, i) =>
        _.map(filterVal, j => {
          if (j === 'index') {
            return i + 1
          } else if (j === 'display_time') {
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
