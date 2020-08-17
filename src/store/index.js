import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'
import Vuex from 'vuex'
import { countObjectProperties } from '@/utils'

Vue.use(Vuex)

const makeAppendChildToParentMutation = ({ parent, child }) =>
  (state, { childId, parentId }) => {
    const resource = state[parent][parentId]

    // Las mutaciones deberian ser responsable de cambiar una parte del estado, pero en este caso es aceptable. ya que necesitamos asegurarnos de que sea valido!.
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }

    Vue.set(resource[child], childId, childId)
  }

export default new Vuex.Store({
  // son iguales a data
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },

  // son iguales a las computed properties
  getters: {
    authUser (state) {
      // return state.users[state.authId]
      return {}
    },

    // Dynamic getters
    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
    userPostsCount: state => id => countObjectProperties(state.users[id].posts),
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
  },

  // son iguales a los methods
  actions: {
    createPost ({ commit, state }, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', { post, postId })
      commit('appendPostToThread', { parentId: post.threadId, childId: postId })
      commit('appendPostToUser', { parentId: post.userId, childId: postId })
      return Promise.resolve(state.posts[postId])
    },

    createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      return new Promise(function (resolve, reject) {
        const threadId = 'greatThread' + Math.random()
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)
        const thread = { '.key': threadId, title, forumId, publishedAt, userId }

        commit('setThread', { thread, threadId })
        commit('appendThreadToForum', { parentId: forumId, childId: threadId })
        commit('appendThreadToUser', { parentId: userId, childId: threadId })

        dispatch('createPost', { text, threadId })
          .then(post => {
            // Actualizamos el thread para que contenga el primer post.
            commit('setThread', { threadId, thread: { ...thread, firstPostId: post['.key'] } })
          })

        resolve(state.threads[threadId])
      })
    },

    updateThread ({ commit, state, dispatch }, { text, title, id }) {
      return new Promise(function (resolve, reject) {
        const thread = state.threads[id]

        const newThread = { ...thread, title: title }
        commit('setThread', { thread: newThread, threadId: id })
        dispatch('updatePost', { id: thread.firstPostId, text })
          .then(() => resolve(newThread))
      })
    },

    updatePost ({ state, commit }, { id, text }) {
      return new Promise((resolve, reject) => {
        const post = state.posts[id]
        commit('setPost', {
          postId: id,
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: state.authId
            }
          }
        })
        resolve(post)
      })
    },

    updateUser ({ commit }, user) {
      commit('setUser', { userId: user['.key'], user })
    },

    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, emoji: '📃' })
    },

    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♀️' })
    },

    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id, emoji: '🗣' })
    },

    fetchItem ({ state, commit }, { id, emoji, resource }) {
      console.log('🔥', emoji, id)
      return new Promise((resolve, reject) => {
        firebase.database().ref(resource).child(id).once('value', snapshot => {
          commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })
          resolve(state[resource][id])
        })
      })
    }
  },

  mutations: {
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
})
