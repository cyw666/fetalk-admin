import Vue from 'vue'
// import _ from 'lodash'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/assets/iconfont/iconfont'
import '@/styles/index.scss' // global css

import App from './App'
import store from '@/store'
import router from '@/router'
import mixins from '@/mixins'
import * as filters from '@/filters' // global filters
import adaptiveTable from '@/directive/adaptive-table'
import globalRegistration from '@/utils/global-registration'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
globalRegistration(Vue)
Vue.use(adaptiveTable.install)
Vue.use(mixins)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(ElementUI, { locale, size: 'small', zIndex: 3000 })

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
