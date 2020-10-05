import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/PageHome'
import ThreadShow from '@/pages/PageThreadShow'
import ThreadCreate from '@/pages/PageThreadCreate'
import ThreadEdit from '@/pages/PageThreadEdit'
import Notfound from '@/pages/PageNotFound'
import Category from '@/pages/PageCategory'
import Forum from '@/pages/PageForum'
import Profile from '@/pages/PageProfile'
import Register from '@/pages/PageRegister'
import SignIn from '@/pages/PageSignIn'

Vue.use(Router)

// El sistema de routeo ba de arriba hacia abajo. Tener cuidado cuando se realiza un ABM. create/edit tienen que ir antes de /elem/:id
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true,
      // Definimos el mismo navigation guard pero a nivel de rutas
      beforeEnter (to, from, next) {
        if (store.state.authId) {
          next()
        } else {
          next({ name: 'Home' })
        }
      }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: { edit: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/logout',
      name: 'SignOut',

      // Normalmente para hacer el logOut, se podria hacer un componente vacio y usar Hooks. Pero se puede usar el aproach de Nav. Guards de la siguiente manera:
      // Lo llamo Componentless(routes with navigation-guard). De esta manera, no necesitamos especificar el componente aqui :).
      beforeEnter (to, from, next) {
        store.dispatch('signOut')
          .then(() => next({ name: 'Home' }))
      }
    },
    {
      path: '*',
      name: 'NotFound',
      // redirect: { name: 'Home' }
      component: Notfound
    }
  ],
  mode: 'history'
})
