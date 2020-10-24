import Vue from 'vue'
import Vuex from 'vuex'

// import de assets(actions/mutatiosns/getters)
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

// imports de modules
import categories from './modules/categories'
import forums from './modules/forums'
import threads from './modules/threads'
import posts from './modules/posts'
import users from './modules/users'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  // son iguales a data
  state: {},

  // son iguales a las computed properties
  getters,

  // son iguales a los methods
  actions,
  mutations,

  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth
  }
})
