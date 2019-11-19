<script>
  import Logo from '~/components/Logo.vue'

  export default {
    components: {
      Logo
    },
    data() {
      return {
        info: {
          timers: [],
          services: [],
          processes: [],
        },
      };
    },
    async asyncData({$axios}) {
      let res = await $axios.get('/api');
      return {
        info: res.data.payload,
      };
    },
    computed: {
      serviceTableCols() {
        return [
          {title: 'Tag', key: 'tag', dataIndex: 'tag'},
          {title: 'UID', key: 'uid', dataIndex: 'uid'},
          {title: '', key: 'operation', dataIndex: 'operation', scopedSlots: { customRender: 'operation' },},
        ];
      },
      serviceTable() {
        let t = [];
        for (let i in this.info.services) {
          const service = this.info.services[i];
          let r = Object.assign({key: 's.' + service.uid, instance: null}, service);
          let c = [];
          for (let ix in r.processes) {
            if(!r.processes.hasOwnProperty(ix)) {
              continue;
            }
            const pid = r.processes[ix];
            c.push({
              key: 'si.' + service.uid + '.' + ix,
              tag: 'instance #' + ix + ' pid #' + pid,
              uid: service.uid,
              instance: ix,
            });
          }
          r.children = c;
          t.push(r);
        }
        return t;
      },
    },
    methods: {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        //console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        //console.log(selected, selectedRows, changeRows);
      },
      async operation(op, record) {
        const parts = record.key.split('.');
        if(parts.length === 2) {
          let res = await this.$axios.$post('/api/service/' + parts[1] + '/' + op);
        }
        else if(parts.length === 3) {
          let res = await this.$axios.$post('/api/service/' + parts[1] + '/' + parts[2] + '/' + op);
        }
      },
      async start(record) {
        return this.operation('start', record);
      },
      async stop(record) {
        return this.operation('stop', record);
      },
      async restart(record) {
        return this.operation('restart', record);
      },
    },
  }
</script>

<template>
  <div class="page-index">

    <a-table :data-source="serviceTable" :columns="serviceTableCols" :row-selection="{onChange, onSelect, onSelectAll}">

      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <a-button-group>
            <a-button @click="() => start(record)">
              Start
            </a-button>
            <a-button @click="() => stop(record)">
              Stop
            </a-button>
            <a-button @click="() => restart(record)">
              Restart
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button :href="'/api/service/' + record.uid + (record.instance === null ? '' : '/' + record.instance) + '/stdout'" target="_blank">
              Output
            </a-button>
          </a-button-group>
        </div>
      </template>

      <template slot="footer" slot-scope="currentPageData">
        Footer
      </template>

    </a-table>

  </div>
</template>

<style lang="scss">
  .editable-row-operations {
    font-size: 1.4rem;
  }
</style>
