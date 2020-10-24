import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  namespaced: true,

  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },

  getters: {
    authUser (state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null
    }
  },

  actions: {
    initAuthentication ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        // unsubscribe observer if already listening | Traduc: Des-subscribe el observador si ya existe.
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }

        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log('🐾 the user has changed')
          if (user) {
            dispatch('fetchAuthUser')
              .then(dbUser => resolve(dbUser))
          } else {
            /* Opcion 2 (signOut): Se podria realizar el dispatch signOut cuando el usuario es null */
            resolve(null)
          }
        })

        commit('setUnsubscribeAuthObserver', unsubscribe)
      })
    },

    registerUserWithEmailAndPassword ({ dispatch }, { email, name, username, password, avatar = null }) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(data => {
          // Es necesario especificar { root: true }, ya que por defecto buscara bajo el mismo modulo (auth/users/createUser). Al especificarlo: users/createUser
          dispatch('users/createUser', { id: data.user.uid, email, name, username, password, avatar }, { root: true })
        })
        .then(() => dispatch('fetchAuthUser')) // Manual: Esto es xq 1ro se autentica y 2do se crea en DB.
    },

    signInUserWithEmailAndPassword (context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    signInWithGoogle ({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
        .then(data => {
          const user = data.user
          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
            if (!snapshot.exists()) {
              dispatch('users/createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL }, { root: true })
                .then(() => dispatch('fetchAuthUser')) // Google: Esto es xq 1ro se autentica y 2do se crea en DB.
            }
          })
        })
    },

    signOut ({ commit }) {
      return firebase.auth().signOut()
        .then(() => {
          commit('setAuthId', null)
        })
    },

    fetchAuthUser ({ dispatch, commit }) {
      const userId = firebase.auth().currentUser.uid
      return new Promise((resolve) => {
        firebase.database().ref('users').child(userId).once('value', snapshot => {
          if (snapshot.exists()) {
            return dispatch('users/fetchUser', { id: userId }, { root: true })
              .then(user => {
                commit('setAuthId', userId)
                resolve(user)
              })
          } else {
            resolve(null)
          }
        })
      })
    }
  },

  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },

    setUnsubscribeAuthObserver (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  }
}
