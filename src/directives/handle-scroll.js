export default {
  bind (el, binding) {
    el.__handleScrollHandler__ = event => binding.value(event)
    document.body.addEventListener('mousewheel', el.__handleScrollHandler__)
    document.body.addEventListener('touchmove', el.__handleScrollHandler__)
  },

  unbind (el) {
    document.body.removeEventListener('mousewheel', el.__handleScrollHandler__)
    document.body.removeEventListener('touchmove', el.__handleScrollHandler__)
  }
}
