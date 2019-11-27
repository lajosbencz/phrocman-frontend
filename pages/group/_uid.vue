<template>
  <div class="page-group">
    <group :info="info" />
  </div>
</template>

<script>
  import Group from "../../components/group";
  export default {
    components: {Group},
    beforeRouteEnter(to, from, next) {
      next(async vm => {
        let info = await vm.$wamp.call('groupInfo', [], {uid: to.params.uid});
        console.log({info});
        vm.info = info;
      });
    },
    name: "page-group",
    data() {
      return {
        info: {},
      };
    },
  }
</script>

<style lang="scss">
  .page-group {

  }
</style>
