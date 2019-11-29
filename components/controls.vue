<template>
    <div class="controls">
      <div class="controls">
        <a-button-group>
          <a-button @click="start" :disabled="running">
            <a-icon type="right" />
            Start
          </a-button>
          <a-button @click="restart" :disabled="!running">
            <a-icon type="retweet" />
            Restart
          </a-button>
          <a-button @click="stop" :disabled="!running">
            <a-icon type="border" />
            Stop
          </a-button>
        </a-button-group>
      </div>
    </div>
</template>

<script>
  export default {
    name: "controls",
    props: {
      running: {
        type: Boolean,
        default: false,
      }
    },
    methods: {
      start() {
        this.$emit('start');
      },
      restart() {
        this.$emit('restart');
      },
      stop() {
        this.$emit('stop');
      },
    },
  }
</script>

<style lang="scss">
  .controls {

  }
</style>
