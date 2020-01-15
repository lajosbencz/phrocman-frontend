<script>
  import Controls from "./controls";
  import Status from "./status";
  export default {
    name: "group",
    components: {Status, Controls},
    props: {
      info: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        _subscription: null,
        loading: false,
      };
    },
    computed: {

    },
    methods: {
      async start() {
        this.loading = true;
        await this.$wamp.call('groupStart', [], {uid: this.info.uid});
        this.loading = false;
      },
      async stop() {
        this.loading = true;
        await this.$wamp.call('groupStop', [], {uid: this.info.uid});
        this.loading = false;
      },
      async restart() {
        this.loading = true;
        await this.$wamp.call('groupRestart', [], {uid: this.info.uid});
        this.loading = false;
      },
    },
  }
</script>

<template>
  <a-card v-on="$listeners" v-bind="$attrs" class="group">

    <div slot="title">

      <div class="ant-breadcrumb">
        <span v-for="parent in info.parents">
          <nuxt-link :to="'/group/' + parent.uid" class="ant-breadcrumb-link">
            {{ parent.name }}
          </nuxt-link>
          <span class="ant-breadcrumb-separator">/</span>
        </span>
        <span>
          <span class="ant-breadcrumb-link">
            {{ info.name }}
            <status :running="info.running" />
          </span>
        </span>
      </div>

      <controls :running="info.running" @start="start" @restart="restart" @stop="stop" />

    </div>

    <div>

      <div v-if="info.services && info.services.length > 0" class="group-services">
        <h4>Services</h4>
        <nuxt-link v-for="service in info.services" :key="service.uid" :to="'/service/'+service.uid" class="antd-btn">
          {{ service.name }}
          <status :running="service.running" />
        </nuxt-link>
      </div>
      <h4 v-else>No services</h4>

      <hr/>

      <div v-if="info.timers && info.timers.length > 0" class="group-timers">
        <h4>Timers</h4>
        <nuxt-link v-for="timer in info.timers" :key="timer.uid" :to="'/timer/'+timer.uid" class="antd-btn">
          {{ timer.name }}
          <status :running="timer.running" />
        </nuxt-link>
      </div>
      <h4 v-else>No timers</h4>

      <hr/>

      <div v-if="info.children && info.children.length > 0" class="group-children">
        <h4>Children</h4>
        <nuxt-link v-for="child in info.children" :key="child.uid" :to="'/group/'+child.uid" class="antd-btn">
          {{ child.name }}
          <status :running="child.running" />
        </nuxt-link>
      </div>
      <h4 v-else>No children</h4>

    </div>
    <div class="loading" v-show="loading">
      <a-spin />
    </div>
  </a-card>
</template>

<style lang="scss">
  .group {
    position: relative;
    margin-top: 24px;

    .loading {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .group-services,
    .group-timers,
    .group-children {
      .antd-btn {
        display: block;
      }
    }

    .group-children {
    }
  }
</style>
