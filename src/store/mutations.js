import Vue from 'vue'

const makeAppendChildToParentMutation = ({ parent, child }) =>
  (state, { childId, parentId }) => {
    const resource = state[parent][parentId]

    // Las mutaciones deberian ser responsable de cambiar una parte del estado, pero en este caso es aceptable. ya que necesitamos asegurarnos de que sea valido!.
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }

    Vue.set(resource[child], childId, childId)
  }

export default {
  setPost (state, { post, postId }) {
    Vue.set(state.posts, postId, post)
  },

  setUser (state, { user, userId }) {
    Vue.set(state.users, userId, user)
  },

  setThread (state, { thread, threadId }) {
    Vue.set(state.threads, threadId, thread)
  },

  setItem (state, { item, id, resource }) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },

  appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
  appendPostToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'posts' }),
  appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
}
