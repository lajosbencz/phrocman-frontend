<script>
  import Logo from '~/components/Logo.vue'
  import Group from "../components/group";

  export default {
    name: 'page-index',
    components: {
      Group,
      Logo
    },
    data() {
      return {};
    },
    computed: {
      info() {
        return this.$store.state.manager;
      }
    },
    methods: {
    },
    mounted() {
    },
  }
</script>

<template>
  <div class="page-index">
    <group :info="info" />
  </div>
</template>

<style lang="scss">
  .editable-row-operations {
    font-size: 1.4rem;
    text-align: right;
  }
</style>
