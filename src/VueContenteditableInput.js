import Component from './VueContenteditableInput.vue'

const VueContenteditableInput = { 
  install (Vue) {
    Vue.component(Component.name, Component)
  }
}

// let GlobalVue = null;
// if (typeof window !== 'undefined') {
//   GlobalVue = window.Vue;
// } else if (typeof global !== 'undefined') {
//   GlobalVue = global.Vue;
// }
// if (GlobalVue) {
//   GlobalVue.use(Component);
// }

if (typeof window !== 'undefined' && window.Vue) {
  console.log('adding to global vue')
  window.Vue.use(Component)
}

export default VueContenteditableInput
