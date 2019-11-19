<template>
  <div class="ckeditor">
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      :disabled="disabled"
      @ready="onEditorReady"
      @focus="onEditorFocus"
      @blur="onEditorBlur"
      @input="onEditorInput"
      @destroy="onEditorDestroy"
    ></ckeditor>
  </div>
</template>

<script>
import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter'
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter'

export default {
  name: 'Editor',
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: this.value,
      editorConfig: {
        // The configuration of the editor.
        language: 'zh-cn', //中文包
        ckfinder: {
          // The URL that the images are uploaded to.
          uploadUrl: 'http://example.com',
        },
      },
    }
  },
  watch: {
    value(newValue) {
      this.editorData = newValue
    },
    editorData(newValue) {
      this.$emit('input', newValue)
    },
  },
  methods: {
    onEditorReady() {
      this.$emit('ready')
    },
    onEditorFocus() {
      this.$emit('focus')
    },
    onEditorBlur() {
      this.$emit('blur')
    },
    onEditorInput() {
      this.$emit('input')
    },
    onEditorDestroy() {
      this.$emit('destroy')
    },
  },
}
</script>

<style lang="scss" scoped>
.ckeditor {
}
</style>
