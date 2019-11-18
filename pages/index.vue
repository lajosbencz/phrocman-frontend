<template>
  <div class="page-index">

    <div v-for="(s, sk) in info.services" :key="sk + s.tag">
      <h4>
        {{ s.tag }}
      </h4>
      <a-button-group>
        <a-button v-for="(pid, ik) in s.instances" :key="sk + s.tag + pid" :href="'http://localhost:8080/stdout/'+sk+'/'+ik" target="_blank">
          {{ pid }}
        </a-button>
      </a-button-group>
    </div>

  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      info: {
        processes: [],
        services: [],
        timers: [],
      },
    };
  },
  async asyncData({$axios}) {
    let res = await $axios.get('http://localhost:8080');
    return {
      info: res.data.payload,
    };
  },
}
</script>

<style lang="scss">
</style>

