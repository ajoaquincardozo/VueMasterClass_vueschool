<template>
    <div class="col-large push-top">
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
          // Encuentra las respuestas
          const replies = Object
            .keys(this.thread.posts)
            .filter(postId => postId !== this.thread.firstPostId)
            .map(postId => this.$store.state.posts[postId])

          // Obtiene los user ids
          const userIds = replies.map(post => post.userId)

          // Cuenta los id unicos.
          return userIds.filter((item, index) => index === userIds.indexOf(item)).length
        },

        posts () {
          const postsIds = Object.values(this.thread.posts)
          return Object.values(this.$store.state.posts)
                       .filter(post => postsIds.includes(post['.key']))
        }
      }
      // methods: {
      //   addPost ({ post }) {
      //   }
      // }
    }
</script>

<style scoped>

</style>