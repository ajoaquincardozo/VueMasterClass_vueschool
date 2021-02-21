import Vue from 'vue'

export default Vue.directive('click-outside', {
  bind (el, binding) {
    el.__ClickOutSideHandler__ = event => {
      // check if event's target is the el or contained by el
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.__ClickOutSideHandler__)
  },
  unbind (el) {
    document.body.removeEventListener('click', el.__ClickOutSideHandler__)
  }
})
