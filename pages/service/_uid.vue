<script>
  import Controls from "../../components/controls";
  import Service from "../../components/service";
  export default {
    name: "page-service",
    components: {Service, Controls},
    beforeRouteEnter(from, to, next) {
      next(async vm => {
        const uid = vm.$route.params.uid;
        //vm.info = await vm.$wamp.call('serviceInfo', [], {uid});
        await vm.updateInfo();
        vm._subscription = await vm.$wamp.subscribe('stdout.' + uid, args => vm.onStdout(...args));
      });
    },
    beforeRouteLeave(from, to, next) {
      next(async vm => {
        if(vm._subscription) {
          await vm.$wamp.unsubscribe(vm._subscription);
        }
      });
    },
    props: {
      limit: {
        type: Number,
        default: 50,
      }
    },
    data() {
      return {
        _subscription: null,
        lines: [],
        info: {},
        loading: false,
      };
    },
    computed: {
      orderedLines() {
        return this.lines.reverse();
      },
    },
    methods: {
      async updateInfo() {
        if(this.loading) return;
        this.loading = true;
        this.info = await this.$wamp.call('serviceInfo', [], {uid: this.$route.params.uid});
        this.loading = false;
      },
      async start() {
        if(this.loading) return;
        this.loading = true;
        let res = await this.$wamp.call('serviceStart', [], {uid: this.$route.params.uid});
        await this.updateInfo();
        this.loading = false;
      },
      async restart() {
        if(this.loading) return;
        this.loading = true;
        let res = await this.$wamp.call('serviceRestart', [], {uid: this.$route.params.uid});
        await this.updateInfo();
        this.loading = false;
      },
      async stop() {
        if(this.loading) return;
        this.loading = true;
        let res = await this.$wamp.call('serviceStop', [], {uid: this.$route.params.uid});
        await this.updateInfo();
        this.loading = false;
      },
      onStdout(data, item, group) {
        this.lines.unshift({
          type: 'stdout',
          message: data,
          item,
          group,
        });
        this.lines.length = Math.min(this.lines.length, this.limit);
      },
      onStderr(data, item, group) {
        this.lines.unshift({
          type: 'stderr',
          message: data,
          item,
          group,
        });
        this.lines.length = Math.min(this.lines.length, this.limit);
      },
    },
  }
</script>

<template>
    <div class="page-service">
      <a-card>
        <service :info="info" @start="start" @restart="restart" @stop="stop" />
      </a-card>
      <p v-for="line in lines" :class="['line-'+line.type]">
        {{ line.message }}
      </p>
      <div class="loading" v-show="loading">
        <a-spin />
      </div>
    </div>
</template>

<style lang="scss">
  .page-service {
    position: relative;

    .loading {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(255,255,255,0.8);
    }
  }
</style>
