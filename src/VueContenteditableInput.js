import Component from './VueContenteditableInput.vue'

const VueContenteditableInput = { 
  install (Vue, options) {
    Vue.component(Component.name, Component)
  }
}

export default VueContenteditableInput
