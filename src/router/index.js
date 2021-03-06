import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import Login from '@/components/Login'
import Logout from '@/components/Logout'
import ListRooms from '@/components/ListRooms'
import NewRoom from '@/components/NewRoom'
import Chat from '@/components/Chat'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'Login',
    component: Login
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },

  {
    path: '/rooms',
    name: 'ListRooms',
    component: ListRooms
  },

  {
    path: '/new-room',
    name: 'NewRoom',
    component: NewRoom
  },

  {
    path: '/chat/:roomTitle',
    name: 'Chat',
    component: Chat,
    props: true,
    beforeEnter: (to, from, next) => {
      console.log(`${from} --> ${to}`)
      if (!store.getters['Room/joinedRoom']) {
        next({ name: 'ListRooms' })
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
