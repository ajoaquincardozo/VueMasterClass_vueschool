<template>
    <div>
        <div class="thread-list">
            <h2 class="list-title">Threads</h2>
            <ThreadListItem
                v-for="thread in threads"
                :thread="thread"
                :key="thread['.key']"
            />
        </div>
    </div>
</template>

<script>
    import ThreadListItem from '@/components/ThreadListItem'

    export default {
      components: {
        ThreadListItem
      },
      props: {
        threads: {
          required: true,
          type: Array
        }
      }
    }
</script>

<style scoped>

</style>