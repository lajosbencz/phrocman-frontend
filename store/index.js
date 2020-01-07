
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
    if(!i) return;
    i.running = running;
  },
  'setServiceState'(state, {uid, running}) {
    const i = _findByUid(state.manager, uid, 'service');
    if(!i) return;
    i.running = running;
  },
  'setTimerState'(state, {uid, running}) {
    const i = _findByUid(state.manager, uid, 'timer');
    if(!i) return;
    i.running = running;
  },
  'setGroup'(state, info) {
    let i = _findByUid(state.manager, uid, 'group');
    if(!i) return;

  },
  'setService'(state, info) {
    let i = _findByUid(state.manager, uid, 'service');

  },
  'setTimer'(state, info) {
    let i = _findByUid(state.manager, uid, 'timer');
  },
};

export const actions = {
  async 'updateManager'({commit}) {
    let manager = await Vue.Wamp.call('index');
    commit('setManager', manager);
    console.log(manager);
  },
};

async function _setState(store, kvArgs)
{
  await store.dispatch('updateManager');
  return;
  console.log(kvArgs);
  switch(kvArgs.type) {
    case 'group':
      let res = await Vue.Wamp.call('groupInfo', {uid: kvArgs.uid});
      console.log(res);
      store.commit('setGroupState', {uid: kvArgs.uid, running: kvArgs.runnable.running});
      break;
    case 'service':
      store.commit('setServiceState', {uid: kvArgs.uid, running: kvArgs.runnable.running});
      break;
    case 'timer':
      store.commit('setTimerState', {uid: kvArgs.uid, running: kvArgs.runnable.running});
      break;
  }
}

export const plugins = [
  async function (store) {
    await store.dispatch('updateManager');
    await Promise.all([
      Vue.Wamp.subscribe('start', async (args, kvArgs, details) => {
        await _setState(store, kvArgs);
      }),
      Vue.Wamp.subscribe('exit', async (args, kvArgs, details) => {
        await _setState(store, kvArgs);
      }),
      Vue.Wamp.subscribe('fail', async (args, kvArgs, details) => {
        await _setState(store, kvArgs);
      }),
    ]);
  },
];
