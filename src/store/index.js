import Vue from 'vue'
import Vuex from 'vuex'

// import de assets(actions/mutatiosns/getters)
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  // son iguales a data
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: null
  },

  // son iguales a las computed properties
  getters,
  // son iguales a los methods
  actions,
  mutations
})
