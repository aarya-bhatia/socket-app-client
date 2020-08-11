import axios from 'axios'

export default {
    namespaced: true,

    state: () => ({
        user: null
    }),

    getters: {
        isLoggedIn(state) {
            if (!state.user) {
                return false
            } else {
                return true
            }
        },

        user(state) {
            return state.user;
        },

        username(state) {
            if (state.user) {
                return state.user.username;
            }
        },

        isLoggedIn(state) {
            if (state.user) {
                return true
            } else {
                return false
            }
        }
    },

    mutations: {
        LOGIN(state, user) {
            state.user = user
            sessionStorage.setItem('user', JSON.stringify(user))
        },

        SET_USER(state, data) {
            state.user = data
        },

        LOGOUT(state) {
            state.user = null;
            sessionStorage.removeItem('user')
        },

        ADD_ROOM(state, room_id) {
            if (state.user) {
                state.user.rooms.push(room_id)
            }
        },

        LEAVE_ROOM(state, room_id) {
            if (state.user) {
                state.user.rooms = state.user.rooms.filter(r => {
                    return r != room_id;
                })
            }
        }
    },

    actions: {
        LOGIN({ rootGetters, commit }, payload) {
            return new Promise((resolve, reject) => {
                axios.post(rootGetters.api + '/users/login', payload)
                    .then(result => {
                        commit('LOGIN', result.data)
                        resolve(result.data)
                    })
                    .catch(err => {
                        reject(err.response.data)
                    })
            })
        },


        RETRIEVE_USER_DATA({ commit, dispatch }) {
            const userData = JSON.parse(sessionStorage.getItem('user'))
            commit('SET_USER', userData)

            Promise.all([
                dispatch("Room/SET_USER", userData.username, { root: true }),
                dispatch("Room/FETCH_ROOM_DATA", userData.rooms, { root: true })
            ])
        },

        LOGOUT({ commit }) {
            commit('LOGOUT')
        },

        SOCKET_NEW_ROOM({ getters, commit }, room) {
            if (room.members.includes(getters.username)) {
                commit('ADD_ROOM', room._id)
            } else {
                console.log(getters.username + ' is not a member of this room!')
            }
        },

        NEW_ROOM({ rootGetters }, data) {
            return new Promise((resolve, reject) => {
                axios.post(rootGetters.api + '/users/join', data)
                    .then(() => {
                        resolve()
                    })
                    .catch(err => {
                        reject(err.response.data)
                    })
            })
        },

        LEAVE_ROOM({ commit }, data) {
            commit('LEAVE_ROOM', data)
        }
    }
}
