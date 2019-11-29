
import Vue from 'vue'

function _findGroupByUid(node, uid)
{
  if(node.uid === uid) {
    return node;
  }
  if(node.children) {
    for (const child of node.children) {
      let r = _findGroupByUid(child, uid);
      if (r) {
        return r;
      }
    }
  }
  return null;
}

function _findByUid(node, uid, sub) {
  if(node.hasOwnProperty(sub)) {
    for (const item of node[sub]) {
      if(item.uid === uid) {
        return item;
      }
    }
  }
  if(node.children) {
    for (const child of node.children) {
      const r = _findByUid(child, uid, sub);
      if(r) {
        return r;
      }
    }
  }
  return null;
}

export const state = () => ({
  manager: {},
});

export const getters = {
  findGroupByUid: (state, getters) => (uid) => {
    return _findGroupByUid(state.manager, uid);
  },
  findServiceByUid: (state, getters) => (uid) => {
    return _findByUid(state.manager, uid, 'services');
  },
  findTimerByUid: (state, getters) => (uid) => {
    return _findByUid(state.manager, uid, 'timers');
  },
};

export const mutations = {
  'setManager'(state, manager) {
    state.manager = manager;
  },
  'setGroupState'(state, {uid, running}) {
    const i = _findGroupByUid(state.manager, uid);
    i.running = running;
  },
  'setServiceState'(state, {uid, running}) {
    const i = _findByUid(state.manager, uid, 'service');
    i.running = running;
  },
  'setTimerState'(state, {uid, running}) {
    const i = _findByUid(state.manager, uid, 'timer');
    i.running = running;
  },
};

export const actions = {
  async 'updateManager'({commit}) {
    let manager = await Vue.Wamp.call('index');
    commit('setManager', manager);
  },
};

export const plugins = [
  async function (store) {
    await store.dispatch('updateManager');
    await Promise.all([
      Vue.Wamp.subscribe('start', (args, kvArgs, details) => {
        console.log('start', {args, kvArgs, details});
      }),
      Vue.Wamp.subscribe('exit', (args, kvArgs, details) => {
        console.log('exit', {args, kvArgs, details});
      }),
      Vue.Wamp.subscribe('fail', (args, kvArgs, details) => {
        console.log('fail', {args, kvArgs, details});
      }),
    ]);
  },
];
