<template>
    <div v-if="thread && user" class="col-large push-top">
        <h1>{{ thread.title }}

          <router-link
            :to="{name: 'ThreadEdit', params: { id: this.id }}"
            class="btn-green btn-small"
            tag="button"
          >
            Edit thread
          </router-link>
        </h1>
        <p>
            By <a href="#" class="link-unstyled">{{ user.name }}</a>, <AppDate :timestamp="thread.publishedAt"/>.
            <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ repliesCount }} replies by {{ contributorsCount }} contributors</span>
        </p>

        <PostList :posts="posts"/>
        
        <!--Example list form child component ->  @<PostEditor save="addPost" :threadId="id"/>-->
        <PostEditor
          :threadId="id"
        />
    </div>
</template>

<script>
    import PostList from '@/components/PostList'
    import PostEditor from '@/components/PostEditor'
    import { countObjectProperties } from '@/utils'

    export default {
      components: {
        PostList,
        PostEditor
      },
      props: {
        id: {
          required: true,
          type: String
        }
      },

      computed: {
        thread () {
          return this.$store.state.threads[this.id]
        },

        repliesCount () {
          return this.$store.getters.threadRepliesCount(this.id)
        },

        user () {
          return this.$store.state.users[this.thread.userId]
        },

        // Cantidad de colaboradores en thread
        contributorsCount () {
          return countObjectProperties(this.thread.contributors)
        },

        posts () {
          const postsIds = Object.values(this.thread.posts)
          return Object.values(this.$store.state.posts)
                       .filter(post => postsIds.includes(post['.key']))
        }
      },

      created () {
        // Para leer una unica vez el thread, sin escuchar cambios usamos -> once. event -> value: will be fired immediately when the connection opens.
        // Se puede pensar como una llamada AJAX sin el costo de una llamada Http.

        // fetch thread
        this.$store.dispatch('fetchThread', { id: this.id }).then(thread => {
          // fetch user
          this.$store.dispatch('fetchUser', { id: thread.userId })

          Object.keys(thread.posts).forEach(postId => {
            // fetch post
            this.$store.dispatch('fetchPost', { id: postId }).then(post => {
              // fetch user per each post.
              this.$store.dispatch('fetchUser', { id: post.userId })
            })
          })
        })
      }

      // methods: {
      //   addPost ({ post }) {
      //   }
      // }
    }
</script>

<style scoped>

</style>