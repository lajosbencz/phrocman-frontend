<template>
  <div class="page-group">
    <group :info="info" />
  </div>
</template>

<script>
  import Group from "../../components/group";
  export default {
    components: {Group},
    name: "page-group",
    data() {
      return {
      //  info: {},
      };
    },
    computed: {
      info() {
        const info = this.$store.getters.findGroupByUid(this.$route.params.uid);
        return info ? info : {};
      },
    },
  }
</script>

<style lang="scss">
  .page-group {

  }
</style>
