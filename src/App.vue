<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <!-- Nota:
        -router-view se encarga de renderizar los componentes. en base al match de URL(Pages). Esto permite condicionar el renderizado globalmente.
          y por medio de una prop, podremos cambiar el estado cuando se recibamos el evento @ready (Importante).

        -Diferencias entre v-if (solo renderiza si es true, caso contrario remueve del DOM) y v-show (siempre renderiza el elemento y lo mantiene en el DOM)
          --v-if: Tiene mayores costos de alternado y v-show: Tiene mayores costos de renderizado inicial. 
            Preferir v-show para alternar muy seguido y v-if cuando no sea propensa a cambiar durante la ejecucion(runtime).
        -->
      <router-view v-show="showPage" @ready="pageReady" />
      <AppSpinner v-show="!showPage"/>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import AppSpinner from '@/components/AppSpinner'
import Nprogress from 'nprogress'

export default {
  components: {
    TheNavbar,
    AppSpinner
  },

  data () {
    return {
      showPage: false
    }
  },

  methods: {
    pageReady () {
      this.showPage = true
      Nprogress.done()
    }
  },

  created () {
    Nprogress.configure({
      speed: 200,
      showSpinner: false
    })

    Nprogress.start()
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      Nprogress.start()
      next()
    })
  }
}
</script>

<style>
@import 'assets/css/style.css';
@import '~nprogress/nprogress.css';

#nprogress .bar {
  background: #57AD8D;
}
</style>

