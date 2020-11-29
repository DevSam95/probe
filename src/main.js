import Vue from 'vue';
import Vuex from 'vuex';
import './plugins/vuetify';
import App from './App.vue';
import router from './router/router.js';
import VueBus from 'vue-bus';

import Login from './vuex/login.js';

import './assets/styles/main.css';

Vue.use(VueBus);
Vue.use(Vuex);

const DEBUG_MODE = !process.env.NODE_ENV === 'production';
const debug = DEBUG_MODE;

const store = new Vuex.Store({
  strict: debug,
  modules: {
    Login
  }
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
