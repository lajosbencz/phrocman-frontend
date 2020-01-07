<script>
  export default {
    name: "status",
    props: {
      running: {
        default: false,
      },
      colorRunning: {
        type: String,
        default: '#0a0',
      },
      colorStopped: {
        type: String,
        default: '#a00',
      },
    },
  }
</script>

<template>
    <span class="status">
      <a-icon v-if="running" type="check-circle" theme="twoTone" :two-tone-color="colorRunning"/>
      <a-icon v-else type="close-circle" theme="twoTone" :two-tone-color="colorStopped"/>
    </span>
</template>

<style lang="scss">
  .status {
  }
</style>
