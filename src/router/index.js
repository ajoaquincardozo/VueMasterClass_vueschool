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
const router = new Router({
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
      // Definimos el mismo navigation guard pero a nivel de rutas | Se movio para realizar de forma global por medio de -> beforeEach
      // beforeEnter (to, from, next) {
      //   store.state.authId ? next() : next({ name: 'Home' })
      // }

      // Metafields: Sirve para identificar rutas y tomar accion.
      meta: { requiresAuth: true }
      // Rutas anidadas (No estan cubiertas por el metafield de componente padre). Para que esten protegidas es necesario, realizar logica en el Global Nav Guard.
      // children: [{ path: 'nested', component: Profile }]
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

// Global Navigation guard[GNG] (trad: Protector de navegacion global)
router.beforeEach((to, from, next) => {
  console.log(`🚦 navigating to ${to.name} from ${from.name}`)
  // Refactor: Movimos observer change User Auth(firebase) de main.js a actions.js y lo utilizamos en GNG.
  // Se realiza de este forma para obtener el user(proceso asyncrono) antes de la redireccion a otra ruta.
  store.dispatch('initAuthentication')
    .then(user => {
      if (to.matched.some(route => route.meta.requiresAuth)) { // protected route
        if (user) {
          next()
        } else {
          next({ name: 'Home' })
        }
      }
    })
  next()
})

export default router
