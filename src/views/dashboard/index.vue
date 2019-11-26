<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-input
      v-model="inputData"
      placeholder="Please input"
      style="width:400px;max-width:100%;"
    />
    <el-button
      v-clipboard:copy="inputData"
      v-clipboard:success="clipboardSuccess"
      type="primary"
      icon="el-icon-document"
    >
      copy
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'Dashboard',
  directives: {
    clipboard,
  },
  computed: {
    ...mapGetters(['name']),
  },
  data() {
    return {
      inputData: 'https://github.com/cyw666/vue-admin-element',
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
