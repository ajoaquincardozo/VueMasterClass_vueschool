import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  // Fetch a unique resource
  fetchItem ({ state, commit }, { id, emoji, resource }) {
    console.log('🔥', emoji, id)
    return new Promise((resolve) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })
        resolve(state[resource].items[id])
      })
    })
  },

  // Fetch multiple resources
  // Promise.all: Recibe un array de promesas y retorna una sola promesa que resolve cuando todas hayan sido resueltas.
  fetchItems ({ dispatch }, { ids, emoji, resource }) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids || {})
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
  }
}
