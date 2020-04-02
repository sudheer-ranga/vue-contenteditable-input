import Component from './VueContenteditableInput.vue'

const VueContenteditableInput = { 
  install (Vue, options) {
    Vue.component(Component.name, Component)
  }
}

let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(Component);
}

export default VueContenteditableInput
