
import Vue from 'vue'

function _findByUid(node, uid) {
  if(node.uid === uid) {
    return node;
  }
  for(let s of ['services', 'timers']) {
    if(node[s]) {
      for (const item of node[s]) {
        if(item.uid === uid) {
          return item;
        }
      }
    }
  }
  if(node.children) {
    for (const child of node.children) {
      const r = _findByUid(child, uid);
      if(r) {
        return r;
      }
    }
  }
  return null;
}

export const state = () => ({
  manager: {
    service: [],
    timer: [],
    children: [],
  },
});

export const getters = {
  findByUid: (state, getters) => (uid) => {
    return _findByUid(state.manager, uid);
  },
};

export const mutations = {
  setManager(state, manager) {
    state.manager = manager;
  },
  setRunning(state, {uid, running}) {
    let node = _findByUid(state.manager, uid);
    if(node) {
      node.running = running;
    }
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
    Vue.Wamp.subscribe('event', (args, kvArgs, details) => {
      if(kvArgs && kvArgs.hasOwnProperty('what') && kvArgs.what.hasOwnProperty('uid') && kvArgs.what.hasOwnProperty('running')) {
        const what = _findByUid(store.state.manager, kvArgs.what.uid, false);
        if(what) {
          store.commit('setRunning', {uid: kvArgs.what.uid, running: !!kvArgs.what.running});
        }
      }
    });
    await store.dispatch('updateManager');
  },
];
