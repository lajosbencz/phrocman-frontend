<script>
  export default {
    async mounted() {
      await this.$wamp.subscribe('stdout', function(args, kwArgs) {
        console.log(args);
      });
    },
  }
</script>

<template>
  <div class="layout-default">
    <nuxt />
  </div>
</template>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }
  html {
    height: 100%;
  }

  .layout-default {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
