import axios from 'axios'

export default {
    namespaced: true,

    state: {
        user: "",
        roomName: "",
        joinedRoom: false,
        messages: [],
        rooms: []
    },

    getters: {

        user(state) {
            return state.user
        },

        joinedRoom(state) {
            return state.joinedRoom
        },

        messages(state) {
            return state.messages
        },

        rooms(state) {
            return state.rooms;
        },

        roomName(state) {
            return state.roomName;
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
        },

        RECIEVE_ROOM_DATA(state, data) {
            state.rooms = data
        },

        SET_USER(state, user) {
            state.user = user
        }
    },

    actions: {
        SET_USER({ commit }, user) {
            commit('SET_USER', user)
        },

        SOCKET_USER_JOINED({ state, commit }, user) {
            commit('NEW_MESSAGE', {
                user: 'server',
                content: `${user} has joined room`
            })
        },

        SOCKET_USER_LEFT({ state, commit }, user) {
            commit('NEW_MESSAGE', {
                user: 'server',
                content: `${user} has left room`
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
        },

        /** Fetching room data from array of room id's */
        FETCH_ROOM_DATA({ rootGetters, commit }, rooms) {
            return new Promise((resolve, reject) => {
                axios.post(rootGetters.api + '/rooms/fetch', { rooms })
                    .then(result => {
                        commit('RECIEVE_ROOM_DATA', result.data)
                        resolve(result.data)
                    })
                    .catch(err => {
                        reject(err.response.data)
                    })
            })
        }

        // CREATE_ROOM({ state, commit }, payload) {
        //     return new Promise((resolve, reject) => {
        //         axios.post(state.api + '/rooms/create', payload)
        //             .then(result => {
        //                 commit('CREATE_ROOM', result.data)
        //                 resolve(result.data)
        //             })
        //             .catch(err => {
        //                 reject(err.response.data)
        //             })
        //     })
        // },
    }
}