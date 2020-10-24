import { makeAppendChildToParentMutation } from '@/store/assetHelpers'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {

  },

  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '🌧' }, { root: true }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🌧', resource: 'forums' }, { root: true })
  },

  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
