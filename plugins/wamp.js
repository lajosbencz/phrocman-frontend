
import Vue from 'vue';
import VueWamp from 'vue-wamp/dist/vue-wamp.esm'


let url = '/ws';
if(process.env.NODE_ENV === 'development') {
  url = 'ws://127.0.0.1/ws';
}
if(process.env.WAMP_URL) {
  url = process.env.WAMP_URL;
}
let realm = 'public';
if(process.env.WAMP_REALM) {
  url = process.env.WAMP_REALM;
}

Vue.use(VueWamp, {
  url,
  realm,
});
