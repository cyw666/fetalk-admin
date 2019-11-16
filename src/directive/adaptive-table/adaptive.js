// import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import _ from 'lodash'
import { setStyle } from '@/utils'
/**
 * How to use
 * <el-table height="100px" v-adaptive-table="{bottomOffset: 30}">...</el-table>
 * el-table height is must be set
 * bottomOffset: 30(default)   // The height of the table from the bottom of the page.
 */

const doResize = (el, binding, vnode) => {
  const { componentInstance: $table, tag } = vnode
  const { value } = binding
  // if (!$table.height) {
  //   throw new Error(`el-$table must set the height. Such as height='100px'`)
  // }
  const bottomOffset = value ? value.bottomOffset : 58

  const height =
    window.innerHeight - el.getBoundingClientRect().top - bottomOffset
  if (tag.indexOf('ElTable') > -1) {
    $table.layout.setHeight(height)
    $table.doLayout()
  } else {
    setStyle(el, { height: height + 'px', overflow: 'auto' })
  }
}

export default {
  bind(el, binding, vnode) {
    el.resizeListener = () => {
      doResize(el, binding, vnode)
    }
    // parameter 1 is must be "Element" type
    window.addEventListener('resize', _.debounce(el.resizeListener, 100))
    // addResizeListener(window.document.body, el.resizeListener)
  },
  inserted(el, binding, vnode) {
    _.delay(() => doResize(el, binding, vnode), 100)
    _.delay(() => doResize(el, binding, vnode), 2000)
  },
  unbind(el) {
    window.removeEventListener('resize', el.resizeListener)
    // removeResizeListener(window.document.body, el.resizeListener)
    el.resizeListener = null
  },
}
