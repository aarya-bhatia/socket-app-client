import axios from 'axios'

export default {
    namespaced: true,

    state: {
        user: "",
        roomName: "",
        joinedRoom: false,
        messages: [],
        rooms: [],
        active: []
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
        },

        active(state) {
            return state.active
        }
    },

    mutations: {
        JOIN_ROOM(state, roomName) {
            state.roomName = roomName
            state.joinedRoom = true
            state.messages = []
        },

        LEAVE_ROOM(state) {
            state.roomName = ""
            state.joinedRoom = false
            state.messages = []
            state.active = []
        },

        NEW_MESSAGE(state, data) {
            state.messages.push(data)
        },

        RECIEVE_ROOM_DATA(state, data) {
            state.rooms = data
        },

        SET_USER(state, user) {
            state.user = user
        },

        SET_ACTIVE_USERS(state, data) {
            state.active = data
        },

        RECIEVE_MESSAGES(state, messages) {
            state.messages = messages.reverse()
        },

        CREATE_ROOM(state, room) {
            state.rooms.push(room)
        },

        ADD_ROOM(state, room) {
            state.rooms.push(room)
        }
    },

    actions: {
        SET_USER({ commit }, user) {
            commit('SET_USER', user)
        },

        SOCKET_USER_JOINED({ commit }, user) {
            commit('NEW_MESSAGE', {
                user: 'server',
                content: `${user} has joined room`
            })
        },

        SOCKET_USER_LEFT({ commit }, user) {
            commit('NEW_MESSAGE', {
                user: 'server',
                content: `${user} has left room`
            })
        },

        SOCKET_NEW_MESSAGE({ commit }, message) {
            commit('NEW_MESSAGE', message)
        },

        SOCKET_NEW_ROOM({ getters, commit }, room) {
            if (room.members.includes(getters.user)) {
                commit('ADD_ROOM', room)
            } else {
                console.log(getters.username + ' is not a member of this room!')
            }
        },

        SOCKET_USER_STATUS({ commit }, data) {
            commit('SET_ACTIVE_USERS', data)
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
        },

        FETCH_MESSAGES({ commit, getters, rootGetters }) {
            return new Promise((resolve, reject) => {

                console.log(rootGetters.api + '/messages/' + getters.roomName)

                axios.get(rootGetters.api + '/messages/' + getters.roomName)
                    .then(result => {
                        commit('RECIEVE_MESSAGES', result.data)
                        resolve(result.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },

        SEND_MESSAGE({ getters, rootGetters }, message) {
            return new Promise((resolve, reject) => {
                axios.post(rootGetters.api + '/messages/' + getters.roomName, message)
                    .then(result => {
                        resolve(result.data)
                    })
                    .catch(err => {
                        reject(err.response.data)
                    })
            })
        },

        CREATE_ROOM({ getters, rootGetters, commit }, payload) {
            return new Promise((resolve, reject) => {
                if (getters.user.length === 0) {
                    console.log(getters.user)
                    reject({ message: "unauthorized" })
                    return
                }
                axios.post(rootGetters.api + '/rooms/create', payload)
                    .then(result => {
                        commit('CREATE_ROOM', result.data)
                        resolve(result.data)
                    }).catch(err => {
                        reject(err.response.data)
                    })
            })
        },
    }
}