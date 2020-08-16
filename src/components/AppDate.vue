<template>
    <span
      :title="timestamp | humanFriendlyDate"
    >
        {{ timestamp | diffForHuman }}
    </span>
</template>

<script>
  import moment from 'moment'

  export default {
    props: {
      timestamp: {
        required: true,
        type: Number
      }
    },
    filters: {
      humanFriendlyDate (date) {
        return moment.unix(date).format('MMM Do YYYY, h:mm:ss a')
      },

      diffForHuman (date) {
        return moment.unix(date).fromNow()
      }
    }
  }
</script>

<style>

</style>