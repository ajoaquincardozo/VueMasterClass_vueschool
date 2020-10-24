<template>
  <div>
    <!-- equivalent v-model === :value="text" @input= "text = $event.target.value" -->
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          name=""
          id=""
          cols="100"
          rows="10"
          class="form-input"
          v-model = "text"
        ></textarea>
      </div>

      <div class="form-actions">
        <button
          v-if="isUpdate"
          @click.prevent="cancel"
          class="btn btn-ghost"
        >
          Cancel
        </button>
        <button class="btn-blue">{{isUpdate ? 'Update': 'Submit post'}}</button>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  // console.log('https://vueschool.io/lessons/communicate-between-components')

  export default {
    props: {
      threadId: {
        required: false,
        type: String
      },

      // Por defecto required: false
      post: {
        type: Object,
        validator: obj => {
          const keyIsValid = typeof obj['.key'] === 'string'
          const textIsValid = typeof obj.text === 'string'
          const isValid = keyIsValid && textIsValid

          // Es posible mostrar en una validacion custom, un mensaje personalizado para identificar el error.
          if (!keyIsValid) {
            console.error('😯 The post prop object must include a `.key` attribute.')
          }

          if (!textIsValid) {
            console.error('😯 The post prop object must include a `text` attribute.')
          }

          return isValid
        }
      }
    },

    data () {
      return {
        text: this.post ? this.post.text : ''
      }
    },

    computed: {
      isUpdate () {
        return !!this.post
      }
    },

    methods: {
      ...mapActions('posts', ['createPost', 'updatePost']),

      save () {
        this.persist()
          .then(post => {
            this.$emit('save', { post })
          })
      },

      cancel () {
        this.$emit('cancel')
      },

      create () {
        const post = {
          text: this.text,
          threadId: this.threadId
        }

        this.text = ''

        // Interaccion hijo/Padre -> Editor avisa al listado que se agregue un post
        this.$emit('save', { post })

        // ya estamos en una instancia de Vue [this.$set], es equivalente a Vue.set(obj, propertyName, value)
        return this.createPost(post)
      },

      update () {
        const payLoad = {
          id: this.post['.key'],
          text: this.text
        }

        return this.updatePost(payLoad)
      },

      persist () {
        return this.isUpdate ? this.update() : this.create()
      }
    }
  }
</script>

<style>

</style>