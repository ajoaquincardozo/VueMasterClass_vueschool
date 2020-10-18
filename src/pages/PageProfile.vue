<template>
  <div class="flex-grid">
    <UserProfileCard
      v-if="!edit"
      :user="user"
    />

    <UserProfileCardEditor
      v-else
      :user="user"
    />

    <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">
              {{ user.username }}'s recent activity
          </span>
          <a href="#">See only started threads?</a>
        </div>

        <hr>

        <PostList :posts="userPosts"/>
    </div>
  </div>
</template>

<script>
  import PostList from '@/components/PostList'
  import UserProfileCard from '@/components/UserProfileCard'
  import UserProfileCardEditor from '@/components/UserProfileCardEditor'
  import asyncDataStatus from '@/mixins/asyncDataStatus'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      PostList,
      UserProfileCard,
      UserProfileCardEditor
    },

    mixins: [asyncDataStatus],

    props: {
      edit: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      ...mapGetters({
        user: 'authUser'
      }),

      userPosts () {
        return this.$store.getters.userPosts(this.user['.key'])
      }
    },

    // Navigation guards
    // Se movio a router/index. Ya que la logica tiene mas sentido que este definido donde se implementan (subjetivo).
    // beforeRouteEnter (to, from, next) {
    //   if (store.state.authId) {
    //     next()
    //   } else {
    //     next({ name: 'Home' })
    //   }
    // },

    // Navega de una ruta a otra, donde ambas renderizan el mismo componente. Ejemplo navegando de un hilo a otro.
    // beforeRouteUpdate (to, from, next) {

    // },

    // beforeRouteLeave (to, from, next) {

    // },

    created () {
      this.$store.dispatch('fetchPosts', { ids: this.user.posts })
        .then(() => this.asyncDataStatus_fetched())
    }
  }
</script>

<style scoped>

</style>