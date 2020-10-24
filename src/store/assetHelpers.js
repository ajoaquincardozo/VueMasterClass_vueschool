import Vue from 'vue'

export const makeAppendChildToParentMutation = ({ parent, child }) =>
  (state, { childId, parentId }) => {
    const resource = state.items[parentId]

    // Las mutaciones deberian ser responsable de cambiar una parte del estado, pero en este caso es aceptable. ya que necesitamos asegurarnos de que sea valido!.
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }

    Vue.set(resource[child], childId, childId)
  }
