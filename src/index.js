import VueDragTree from './VueDragTree.vue'

const VueDragTreeComponent = {
  install: function(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('VueDragTree', VueDragTree)
  }
}

export default VueDragTreeComponent
