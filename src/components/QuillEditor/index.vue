<template>
  <div ref="editor"></div>
</template>

<script>
import _ from 'lodash'
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import defaultOptions from './options'

export default {
  name: 'QuillEditor',
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      quill: null,
      currentValue: '',
      defaultOptions,
    }
  },
  watch: {
    value: {
      handler(val) {
        // 确认是新的值
        if (this.quill) {
          if (val && val !== this.currentValue) {
            this.currentValue = val
            this.quill.pasteHTML(this.value)
          } else if (!val) {
            this.quill.setText('')
          }
        }
      },
      immediate: true,
    },
    // Watch disabled change
    disabled(newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    // Init Quill instance
    init() {
      // Options
      const _options = _.assign({}, this.defaultOptions, this.options)
      debugger
      // 初始化编辑器
      this.quill = new Quill(this.$refs.editor, _options)
      this.quill.enable(false)
      // Disabled editor
      if (!this.disabled) {
        this.quill.enable(true)
      }
      // 默认值
      this.quill.pasteHTML(this.currentValue)
      // 绑定事件
      this.quill.on('text-change', (delta, oldDelta, source) => {
        let html = this.$refs.editor.children[0].innerHTML
        const text = this.quill.getText()
        const quill = this.quill
        if (html === '<p><br></p>') html = ''
        // 更新内部的值
        this.currentValue = html
        // 发出事件 v-model
        this.$emit('input', html)
        // 发出事件
        this.$emit('change', { html, text, quill })
      })
      this.quill.on('selection-change', (range, oldRange, source) => {
        if (!range) {
          this.$emit('blur', this.quill)
        } else {
          this.$emit('focus', this.quill)
        }
      })
      // Emit ready event
      this.$emit('ready', this.quill)
    },
  },
}
</script>
