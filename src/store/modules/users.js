import Vue from 'vue'
import { countObjectProperties, removeEmptyProperties } from '@/utils'
import { makeAppendChildToParentMutation } from '@/store/assetHelpers'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {
    userPosts: (state, getters, rootState) => id => {
      const user = state.items[id]
      if (user.posts) {
        return Object.values(rootState.posts.items)
          .filter(post => post.userId === id)
      }
      return []
    },

    // Dynamic getters
    userThreadsCount: state => id => countObjectProperties(state.items[id].threads),
    userPostsCount: state => id => countObjectProperties(state.items[id].posts)
  },

  actions: {
    createUser ({ state, commit }, { id, name, username, email, avatar = null }) {
      return new Promise(function (resolve) {
        const registeredAt = Math.floor(Date.now() / 1000)
        const usernameLower = username.toLowerCase()
        email = email.toLowerCase()
        const user = { avatar, email, name, username, usernameLower, registeredAt }

        firebase.database().ref('users').child(id).set(user)
          .then(() => {
            commit('setItem', { resource: 'users', id: id, item: user }, { root: true })
            resolve(state.items[id])
          })
      })
    },

    updateUser ({ commit }, user) {
      const updates = {
        avatar: user.avatar,
        username: user.username,
        name: user.name,
        bio: user.bio,
        website: user.website,
        email: user.email,
        location: user.location
      }

      return new Promise((resolve) => {
        firebase.database().ref('users').child(user['.key']).update(removeEmptyProperties(updates))
          .then(() => {
            commit('users/setUser', { userId: user['.key'], user }, { root: true })
            resolve(user)
          })
      })
    },

    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♀️' }, { root: true }),
    fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🙋‍♀️', resource: 'users' }, { root: true })
  },

  mutations: {
    setUser (state, { user, userId }) {
      Vue.set(state.items, userId, user)
    },

    appendPostToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'posts' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
  }

  // Se temina la leccion 'Split a Large Vuex Store Into Namespaced Modules', queda revisar en la siguiente leccion el refactor realizado.
}
