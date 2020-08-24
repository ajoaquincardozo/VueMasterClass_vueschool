import firebase from 'firebase/app'
import 'firebase/database'

export default {
  createPost ({ commit, state }, post) {
    const postId = firebase.database().ref('posts').push().key
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`users/${post.userId}/posts/${postId}`] = postId
    firebase.database().ref().update(updates)
      .then(() => {
        commit('setItem', { resource: 'posts', item: post, id: postId })
        commit('appendPostToThread', { parentId: post.threadId, childId: postId })
        commit('appendPostToUser', { parentId: post.userId, childId: postId })
        return Promise.resolve(state.posts[postId])
      })
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

  // Fetch a unique resource
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '🌧' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '📃' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '🗣' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♀️' }),

  // Fetch multiple resources
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🏷', resource: 'categories' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🌧', resource: 'forums' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '📃', resource: 'threads' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🗣', resource: 'posts' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🙋‍♀️', resource: 'users' }),

  fetchAllCategories ({ state, commit }) {
    console.log('🔥', '📂', 'all')
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          commit('setItem', { resource: 'categories', id: categoryId, item: category })
        })

        resolve(Object.values(state.categories))
      })
    })
  },

  fetchItem ({ state, commit }, { id, emoji, resource }) {
    console.log('🔥', emoji, id)
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })
        resolve(state[resource][id])
      })
    })
  },

  // Promise.all: Recibe un array de promesas y retorna una sola promesa que resolve cuando todas hayan sido resueltas.
  fetchItems ({ dispatch }, { ids, emoji, resource }) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
  }
}
