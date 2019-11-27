<script>
  export default {
    name: "group",
    props: {
      info: {
        type: Object,
        required: true,
      },
    },
    methods: {
      async start() {
        console.log(this.info);
        await this.$wamp.call('groupStart', [], {uid: this.info.uid});
      },
      async stop() {
        console.log(this.info);
        await this.$wamp.call('groupStop', [], {uid: this.info.uid});
      },
      async restart() {
        console.log(this.info);
        await this.$wamp.call('groupRestart', [], {uid: this.info.uid});
      },
    },
  }
</script>

<template>
    <div class="group">
      <h4>{{ info.name }}</h4>
      <div class="controls">
        <a-button-group>
          <a-button @click="start">
            <a-icon type="right" />
            Start
          </a-button>
          <a-button @click="restart">
            <a-icon type="retweet" />
            Restart
          </a-button>
          <a-button @click="stop">
            <a-icon type="border" />
            Stop
          </a-button>
        </a-button-group>
      </div>
      <a-button-group class="group-children">
        <nuxt-link v-for="child in info.children" :key="child.uid" :to="'/group/'+child.uid" class="antd-btn">
          {{ child.name }}
        </nuxt-link>
        <!--
        <group :info="child" />
        -->
      </a-button-group>
    </div>
</template>

<style lang="scss">
  .group {

    .group-children {
    }
  }
</style>
