<template>
  <header class="header" id="header">

    <router-link
      :to="{name: 'Home'}"
      class="logo"
    >
      <img src="../assets/img/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
        <ul v-if="user">
          <!-- Tratamiento de renderizado en manejo de data asincrona -> v-if -->
          <li class="navbar-user">
            <a @click.prevent="userDropDownOpen = !userDropDownOpen">
              <img class="avatar-small" :src="user.avatar" alt="">
              <span>
                {{user.name}}
                <img class="icon-profile" src="../assets/img/arrow-profile.svg" alt="">
              </span>
            </a>

            <!-- dropdown menu -->
            <!-- add class "active-drop" to show the dropdown -->
            <div id="user-dropdown" :class="{ 'active-drop': userDropDownOpen }">
              <div class="triangle-drop"></div>
              <ul class="dropdown-menu">
                  <li class="dropdown-menu-item">
                    <router-link :to="{name: 'Profile'}">View Profile</router-link>
                  </li>
                  <li class="dropdown-menu-item">
                    <a @click.prevent="$store.dispatch('signOut')">SignOut</a>
                  </li>
              </ul>
            </div>
          </li>
        </ul>
        <ul v-else>
          <li class="navbar-item">
            <router-link :to="{name: 'SignIn'}">Sign In</router-link>
          </li>
          <li class="navbar-item">
            <router-link :to="{name: 'Register'}">Register</router-link>
          </li>
        </ul>
    </nav>
  </header>
</template>

<script>
// Cuando son componentes de instancia unica -> se recomienda TheNameComponent. Ver Style guide Vue.
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      userDropDownOpen: false
    }
  },

  computed: {
    ...mapGetters({
      'user': 'authUser'
    })
  }
}
</script>

<style>

</style>