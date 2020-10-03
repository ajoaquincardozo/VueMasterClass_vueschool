<template>
  <div class="flex-grid">
    <h1>My profile</h1>
    <!-- <UserProfileCard
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
    </div> -->
  </div>
</template>

<script>
  import PostList from '@/components/PostList'
  import UserProfileCard from '@/components/UserProfileCard'
  import UserProfileCardEditor from '@/components/UserProfileCardEditor'
  import { mapGetters } from 'vuex'
  import store from '@/store'

  export default {
    components: {
      PostList,
      UserProfileCard,
      UserProfileCardEditor
    },

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
        if (this.user.posts) {
          return Object.values(this.$store.state.posts)
            .filter(post => post.userId === this.user['.key'])
        }
        return []
      }
    },

    // Navigation guards
    beforeRouteEnter (to, from, next) {
      if (store.state.authId) {
        next()
      } else {
        next({ name: 'Home' })
      }
    },

    // Navega de una ruta a otra, donde ambas renderizan el mismo componente. Ejemplo navegando de un hilo a otro.
    // beforeRouteUpdate (to, from, next) {

    // },

    // beforeRouteLeave (to, from, next) {

    // },

    created () {
      this.$emit('ready')
    }
  }
</script>

<style scoped>

</style>