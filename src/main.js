import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'

Vue.config.productionTip = false

const SocketInstance = socketio.connect('http://localhost:3000/chats', { reconnection: false });

Vue.use(new VueSocketio({
  debug: true,
  connection: SocketInstance,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

export default SocketInstance;