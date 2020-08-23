// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import store from './store'
import AppDate from '@/components/AppDate'

Vue.component('AppDate', AppDate)
Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDB4iWeBq40NRl6MeH7qdJobiZTwVJ26n8',
  authDomain: 'vue-school-forum-11bc5.firebaseapp.com',
  databaseURL: 'https://vue-school-forum-11bc5.firebaseio.com',
  projectId: 'vue-school-forum-11bc5',
  storageBucket: 'vue-school-forum-11bc5.appspot.com',
  messagingSenderId: '579271514916',
  appId: '1:579271514916:web:42709066b8b2069de5f1b1'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeCreate () {
    store.dispatch('fetchUser', { id: store.state.authId })
  }
})
