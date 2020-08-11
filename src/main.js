import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import router from './router'
import VueChatScroll from 'vue-chat-scroll'

Vue.config.productionTip = false

function getSocketInstance(pathAppend) {
  return socketio.connect(store.getters.api + pathAppend, {
    reconnection: false
  })
}

//Root connection
Vue.use(
  new VueSocketio({
    connection: getSocketInstance(),
    debug: false,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
    },
  }),
);

// Namespace chats
Vue.use(new VueSocketio({
  debug: true,
  connection: getSocketInstance('/chats'),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));

Vue.use(VueChatScroll)


router.beforeEach((to, from, next) => {
  console.log(`to: ${to.path} from: ${from.path}`)

  if (to.name !== 'Login' && !store.getters['Auth/isLoggedIn']) {
    // not logged in but has session storage
    if (sessionStorage.getItem('user')) {
      console.log('fetching...')
      store.dispatch('Auth/RETRIEVE_USER_DATA').then(() => {
        console.log('retrieved user and rooms')
        next()
      }).catch(err => {
        console.log(err)
        next({ name: 'Login' })
      })
    }
    // not logged in and does not have session storage
    else {
      next({ name: 'Login' })
    }
  }
  else {
    next()
  }
})


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
