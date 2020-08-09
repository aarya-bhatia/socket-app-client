import axios from 'axios'

export default {
    namespaced: true,

    state: () => ({
        user: null
    }),

    getters: {
        user(state) {
            return state.user;
        },

        isLoggedIn(state) {
            if(state.user) {
                return true
            } else {
                return false
            }
        }
    },

    mutations: {
        LOGIN(state, user) {
            state.user = user
        },

        LOGOUT(state) {
            state.user = null;
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
        }
    }
}
