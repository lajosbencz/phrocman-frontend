<script>
  import Controls from "./controls";
  import Status from "./status";
  export default {
    name: "service",
    components: {Status, Controls},
    props: {
      info: {
        required: true,
        type: Object,
      },
    },
    methods: {
    },
  }
</script>

<template>
    <div class="service" v-if="info.hasOwnProperty('instances')">
      <h4>
        {{ info.name }}
        <status :running="info.running" />
      </h4>
      <controls :running="info.running" @start="$emit('start')" @restart="$emit('restart')" @stop="$emit('stop')" />
      <br/>
      <h4>{{ info.instances.length }} instances:</h4>
      <span v-for="instance in info.instances">
        #{{ instance.pid }}
      </span>
    </div>
</template>

<style lang="scss">
  .service {

  }
</style>
