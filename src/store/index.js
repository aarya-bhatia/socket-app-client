import Vue from 'vue'
import Vuex from 'vuex'

import Room from './room'
import Auth from './auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: 'http://localhost:3000',
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
    }
  },

  modules: {
    Room,
    Auth
  }
})
