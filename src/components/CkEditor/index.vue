<template>
  <div class="ckeditor">
    <ckeditor
      v-model="editorData"
      :editor="editor"
      :config="editorConfig"
      :disabled="disabled"
      @ready="onEditorReady"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @input="$emit('change')"
      @destroy="$emit('destroy')"
    ></ckeditor>
  </div>
</template>

<script>
// import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Link from '@ckeditor/ckeditor5-link/src/link'
import List from '@ckeditor/ckeditor5-list/src/list'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight' // Coloring text background
import Font from '@ckeditor/ckeditor5-font/src/font'
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter'
import viewToPlainText from '@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext'

export default {
  name: 'CkEditor',
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
    language: {
      type: String,
      default: 'zh-cn',
    },
    placeholder: {
      type: String,
      default: '请输入内容...',
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: this.value,
      editorConfig: {
        // The configuration of the editor.
        language: this.language,
        placeholder: this.placeholder,
        plugins: [
          Essentials,
          Bold,
          Italic,
          Paragraph,
          Heading,
          Alignment,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          Link,
          List,
          BlockQuote,
          Highlight,
          Font,
          FontFamily,
          MediaEmbed,
          Table,
          TableToolbar,
          Base64UploadAdapter,
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'undo',
            'redo',
            '|',
            'fontFamily',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'alignment',
            'bold',
            'italic',
            'link',
            'blockquote',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'imageStyle:full',
            'imageStyle:side',
            'imageTextAlternative',
            '|',
            'imageUpload',
            '|',
            'highlight',
            'mediaEmbed',
            'insertTable',
          ],
        },
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph',
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1',
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2',
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3',
            },
          ],
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
        highlight: {
          options: [
            {
              model: 'greenMarker',
              class: 'marker-green',
              title: 'Green marker',
              color: 'var(--ck-highlight-marker-green)',
              type: 'marker',
            },
            {
              model: 'redPen',
              class: 'pen-red',
              title: 'Red pen',
              color: 'var(--ck-highlight-pen-red)',
              type: 'pen',
            },
          ],
        },
        // ckfinder: {
        //   uploadUrl: 'http://example.com',
        // },
      },
      editorClass: null,
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
    onEditorReady(editor) {
      this.editorClass = editor
      this.$emit('ready', editor)
    },
    getText() {
      const text = viewToPlainText(
        this.editorClass.editing.view.document.getRoot()
      )
      return text
    },
  },
}
</script>

<style lang="scss" scoped>
.ckeditor {
  ::v-deep {
    .ck-content {
      min-height: 350px;
    }
  }
}
</style>
