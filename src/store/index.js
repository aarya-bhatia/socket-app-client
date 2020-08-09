import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: "",
    roomName: "",
    joinedRoom: false,
    messages: [],
    connected: false
  },

  getters: {
    isConnected(state) {
      return state.connected
    },

    joinedRoom(state) {
      return state.joinedRoom
    },

    messages(state) {
      return state.messages
    }
  },

  mutations: {

    JOIN_ROOM(state, { roomName, user }) {
      state.roomName = roomName
      state.user = user
      state.joinedRoom = true
      state.messages = []
    },

    LEAVE_ROOM(state) {
      state.roomName = ""
      state.user = ""
      state.joinedRoom = false
      state.messages = []
    },

    NEW_MESSAGE(state, data) {
      state.messages.push(data)
    }
  },

  actions: {

    SOCKET_connect({ state }) {
      state.connected = true
      console.log("socket connected");
    },

    SOCKET_USER_JOINED({ state, commit }, user) {
      commit('NEW_MESSAGE', {
        user: 'server',
        content: `${user} has joined room ${state.roomName}!`
      })
    },

    SOCKET_USER_LEFT({ state, commit }, user) {
      commit('NEW_MESSAGE', {
        user: 'server',
        content: `${user} has left room ${state.roomName}!`
      })
    },

    SOCKET_NEW_MESSAGE({ commit }, message) {
      commit('NEW_MESSAGE', message)
    },

    JOIN_ROOM({ commit }, data) {
      commit('JOIN_ROOM', data)
    },

    LEAVE_ROOM({ commit }) {
      commit('LEAVE_ROOM')
    }
  }
})
