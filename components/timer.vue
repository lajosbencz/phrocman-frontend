<template>
    <div class="timer">
      <h4>{{ info.name }}</h4>
    </div>
</template>

<script>
  export default {
    name: "timer",
    props: {
      info: {
        required: true,
        type: Object,
      },
    },
  }
</script>

<style lang="scss">
  .timer {

  }
</style>
