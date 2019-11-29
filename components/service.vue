<template>
    <div class="service">
      <h4>{{ info.name }}</h4>
    </div>
</template>

<script>
  export default {
    name: "service",
    props: {
      info: {
        required: true,
        type: Object,
      },
    },
  }
</script>

<style lang="scss">
  .service {

  }
</style>
