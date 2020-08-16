<template>
  <div>
    <CategoyListItem
      v-for="category in categories"
      :category="category"
      :key="category['.key']"
    />
  </div>
</template>

<script>
  import CategoyListItem from './CategoryListItem'

  export default {
    components: {
      CategoyListItem
    },
    props: {
      categories: {
        required: true,
        type: Array
      }
    }
  }
</script>

<style>

</style>