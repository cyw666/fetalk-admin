<template>
  <div ref="editor"></div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      Quill: undefined,
      currentValue: '',

      defaultOptions: {
        theme: 'snow',
        bounds: document.body,
        debug: 'warn',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image'],
          ],
        },
        placeholder: '书写你的内容',
        readOnly: this.disabled,
      },
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.Quill = null
    delete this.Quill
  },
  methods: {
    init() {
      // Options
      const _options = Object.assign({}, this.defaultOptions, this.options)
      const editor = this.$refs.editor
      // 初始化编辑器
      this.Quill = new Quill(editor, _options)
      // 默认值
      this.Quill.pasteHTML(this.currentValue)
      this.height && this.setHeight(this.height)
      // 绑定事件
      this.Quill.on('text-change', (delta, oldDelta, source) => {
        const html = this.$refs.editor.children[0].innerHTML
        const text = this.Quill.getText()
        const quill = this.Quill
        // 更新内部的值
        this.currentValue = html
        // 发出事件 v-model
        this.$emit('input', html)
        // 发出事件
        this.$emit('change', { html, text, quill })
      })

      this.Quill.on('selection-change', (range, oldRange, source) => {
        if (!range) {
          this.$emit('blur', this.Quill)
        } else {
          this.$emit('focus', this.Quill)
        }
      })

      // Emit ready event
      this.$emit('ready', this.quill)
    },
    setHeight(height) {
      this.Quill.container.style.height = `${height}px`
    },
  },
  watch: {
    value: {
      handler(val) {
        // 确认是新的值
        if (val !== this.currentValue) {
          this.currentValue = val
          // 尝试更新
          if (this.Quill) {
            this.Quill.pasteHTML(this.value)
          }
        }
      },
      immediate: true,
    },
    // Watch disabled change
    disabled(newVal, oldVal) {
      if (this.Quill) {
        this.Quill.enable(!newVal)
      }
    },
  },
}
</script>