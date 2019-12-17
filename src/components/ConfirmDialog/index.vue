<template>
  <el-dialog
    :visible.sync="innserVisible"
    :width="width"
    :show-close="false"
    :close-on-click-modal="closeBymodal"
    custom-class="confirm-dialog"
    :top="top"
  >
    <div slot="title" class="confirm-dialog-header">
      {{ title }}
    </div>
    <div class="confirm-dialog-content">
      <slot></slot>
    </div>
    <div slot="footer" class="confirm-dialog-footer">
      <el-button
        v-show="showCancle"
        class="cancel"
        type="default"
        @click="closeDialog"
        >取消</el-button
      >
      <el-button
        v-show="showConfirm"
        class="confirm"
        type="primary"
        @click="confirmDialog"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    visible: {
      type: Boolean,
      required: true,
    },
    width: {
      type: String,
      required: false,
      default: '420',
    },
    closeBymodal: {
      type: Boolean,
      default: true,
    },
    showConfirm: {
      type: Boolean,
      default: true,
    },
    showCancle: {
      type: Boolean,
      default: true,
    },
    top: {
      type: String,
      default: '15vh',
    },
  },
  data() {
    return {
      innserVisible: this.visible,
    }
  },
  computed: {},
  watch: {
    innserVisible: function(newVal, oldVal) {
      if (newVal === oldVal) return
      this.$emit('update:visible', newVal)
    },
    visible: function(newVal, oldVal) {
      if (newVal === oldVal) return
      this.innserVisible = this.visible
    },
  },
  created() {},
  mounted() {},
  methods: {
    closeDialog() {
      this.innserVisible = false
      this.$emit('close')
    },
    confirmDialog() {
      this.$emit('confirm')
    },
  },
}
</script>

<style lang="scss">
div.confirm-dialog {
  // border-radius: 10px;
  // overflow: hidden;
  // .el-dialog__header {
  //   height: 64px;
  //   padding: 0;
  // }
  // .el-dialog__body {
  //   padding: 20px;
  //   background: #eaf9fb;
  // }
  // .el-dialog__footer {
  //   padding: 0;
  // }
  // &-header {
  //   padding: 0 20px;
  //   height: 64px;
  //   display: flex;
  //   justify-content: flex-start;
  //   align-items: center;
  //   font-size: 18px;
  //   color: $--color-white;
  // }

  // &-content {
  //   background-color: $--color-white;
  //   padding: 0;
  //   max-height: 80%;
  // }
  // &-footer {
  //   .cancel {
  //     color: $--color-text-regular;
  //     &:hover {
  //       color: $--color-primary;
  //     }
  //   }
  //   .confirm {
  //     color: $--color-primary;
  //     &:hover {
  //       color: $--color-primary-light-2;
  //     }
  //   }
  // }
}
</style>
