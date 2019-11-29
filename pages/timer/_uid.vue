<script>
  export default {
    name: "page-timer",
    computed: {
      info() {
        return this.$store.getters.findTimerByUid(this.$route.params.uid);
      },
    },
  }
</script>

<template>
    <div class="page-timer">
      {{ info.name }}
    </div>
</template>

<style lang="scss">

</style>
