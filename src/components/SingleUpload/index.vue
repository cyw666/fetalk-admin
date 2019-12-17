<template>
  <el-upload
    class="single-uploader"
    action="/api/admin/upload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeImgUpload"
    :headers="{ Authorization: `Bearer ${token}` }"
  >
    <el-image
      v-if="imgUrl"
      :src="imgUrl"
      :fit="fit"
      class="view-img"
    ></el-image>
    <!-- <img v-if="imgUrl" :src="imgUrl" class="view-img" /> -->
    <i v-else class="el-icon-plus uploader-icon"></i>
  </el-upload>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SingleUpload',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    fit: {
      type: String,
      default: 'contain',
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
    }),
    imgUrl: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    beforeImgUpload(file) {
      const isImage = file.type.indexOf('image') > -1
      if (!isImage) {
        this.$message.error('您上传的格式不支持！')
      }
      return isImage
    },
    handleSuccess(res, file) {
      if (file.status === 'success') {
        this.imgUrl = res.url
        this.$emit('on-success', res, file)
      } else {
        this.$message.error('上传错误！')
      }
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
