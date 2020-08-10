import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import router from './router'
import VueChatScroll from 'vue-chat-scroll'

Vue.config.productionTip = false

const SocketInstance = socketio.connect(store.getters.api + '/chats', { reconnection: false });

Vue.use(new VueSocketio({
  debug: true,
  connection: SocketInstance,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));

Vue.use(VueChatScroll)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
