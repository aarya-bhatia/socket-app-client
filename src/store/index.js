import Vue from 'vue'
import Vuex from 'vuex'

import Room from './room'
import Auth from './auth'

Vue.use(Vuex)

//api: 'http://localhost:3000'

export default new Vuex.Store({
  state: {
    api: 'https://sleepy-peak-50290.herokuapp.com',
    //api: 'http://localhost:3000',
    connected: false
  },

  getters: {
    isConnected(state) {
      return state.connected
    },

    api(state) {
      return state.api;
    }
  },

  mutations: {
  },

  actions: {

    SOCKET_connect({ state }) {
      state.connected = true
      console.log("socket connected");
    },

    SOCKET_TOTAL_CONNECTIONS(context, data) {
      console.log("total connections -> ", data);
    },
  },

  modules: {
    Room,
    Auth
  }
})
