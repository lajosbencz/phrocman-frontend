<script>
  import Logo from '~/components/Logo.vue'

  export default {
    name: 'page-index',
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
              pid: pid,
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
          let res = await this.$wamp.call('service' + op, [], {
            uid: parts[1],
          });
        }
        else if(parts.length === 3) {
          let res = await this.$wamp.call('serviceInstance' + op, [], {
            uid: parts[1],
            instance: parts[2],
          });
        }
      },
      async start(record) {
        return this.operation('Start', record);
      },
      async stop(record) {
        return this.operation('Stop', record);
      },
      async restart(record) {
        return this.operation('Restart', record);
      },
      updateProcesses(kvArgs, value) {
        const s = this.info.services.findIndex(i => i.uid === kvArgs.uid);
        this.info.services[s].processes.forEach((item, x) => {
          if(kvArgs.instance === null || kvArgs.instance === x) {
            this.$set(this.info.services[s].processes, x, value);
          }
        });
        this.info.processes.forEach((item, x) => {
          let i = Object.assign({}, item);
          if(i.uid === kvArgs.uid && (kvArgs.instance === null || kvArgs.instance === i.instance)) {
            this.$set(this.info.processes[x], 'pid', value);
          }
        });
      },
    },
    mounted() {
      this.$wamp.call('index').then(r => {
        this.info = r.payload;
      });
      this.$wamp.subscribe('service.start', (args, kvArgs, details) => {
        if(kvArgs.pid) {
          console.log('process started', kvArgs);
          this.updateProcesses(kvArgs, kvArgs.pid);
        }
      });
      this.$wamp.subscribe('service.stop', (args, kvArgs, details) => {
        console.log('process stopped', kvArgs);
        this.updateProcesses(kvArgs, false);
      });
      this.$wamp.subscribe('service.fail', (args, kvArgs, details) => {
        console.log('process failed', kvArgs);
        this.updateProcesses(kvArgs, false);
      });
    }
  }
</script>

<template>
  <div class="page-index">

    <a-table :data-source="serviceTable" :columns="serviceTableCols" :row-selection="{onChange, onSelect, onSelectAll}">

      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <a-button-group v-if="record.instance === null">
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
          <a-button-group v-else>
            <a-button :disabled="record.pid !== false" @click="() => start(record)">
              Start
            </a-button>
            <a-button :disabled="record.pid === false" @click="() => stop(record)">
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
    text-align: right;
  }
</style>
