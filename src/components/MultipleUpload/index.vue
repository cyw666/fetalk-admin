<template>
  <div class="multiple__wrapper">
    <el-upload
      class="multiple-uploader"
      action="/api/admin/upload"
      list-type="picture-card"
      multiple
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :on-success="handleSuccess"
      :headers="{ Authorization: `Bearer ${token}` }"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal="false">
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  name: 'MultipleUpload',
  props: {
    value: {
      type: Array,
      required: true,
      default: () => [],
    },
    fit: {
      type: String,
      default: 'contain',
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: this.value,
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
    }),
  },
  methods: {
    handleSuccess(res, file, fileList) {
      if (file.status === 'success') {
        this.imgUrl = res.url
        var files = this.transformFiles(fileList)
        this.$emit('input', files)
        this.$emit('on-success', res, file, fileList)
      } else {
        this.$message.error('上传错误！')
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      var files = this.transformFiles(fileList)
      this.$emit('input', files)
      this.$emit('input', files)
    },
    transformFiles(list) {
      if (!list || list.length <= 0) return []
      return _.map(list, v => v.response)
    },
  },
  watch: {
    value: {
      handler(val) {
        this.fileList = val
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.single-uploader {
  width: 312px;
  height: 176px;
  ::v-deep {
    .el-upload {
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
  .view-img {
    width: 100%;
    height: 100%;
  }
  .uploader-icon {
    font-size: 25px;
    color: $--icon-color-base;
    text-align: center;
  }
}
</style>
