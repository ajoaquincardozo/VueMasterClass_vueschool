<template>
  <form @submit.prevent="save">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input
          v-model="form.title"
          type="text"
          id="thread_title"
          class="form-input"
          name="title">
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea
          v-model="form.text"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"></textarea>
      </div>

      <div class="btn-group">
        <button @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">{{isUpdate ? 'Update' : 'Publish'}} </button>
      </div>
  </form>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },

    text: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },

  computed: {
    isUpdate () {
      return !!this.title
    }
  },

  methods: {
    // Es posible hacerlo de 2 maneras: | Se opta por la primera en esta ocasion.
    // 1-emitimos un evento para que el padre lo maneje y realizar el dispatch, 2-Maneja el dispatch(create/update) in place.
    save () {
      this.$emit('save', { title: this.form.title, text: this.form.text })
    },

    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>