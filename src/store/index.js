import Vue from 'vue'
import Vuex from 'vuex'

import Room from './room'
import Auth from './auth'

Vue.use(Vuex)

//api: 'http://localhost:3000'

export default new Vuex.Store({
  state: {
    api: 'https://sleepy-peak-50290.herokuapp.com',
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
