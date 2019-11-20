import adaptive from './adaptive'

const install = function(Vue) {
  Vue.directive('adaptive-table', adaptive)
}

adaptive.install = install
export default adaptive
