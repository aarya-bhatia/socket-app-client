import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Login'
import Logout from '@/components/Logout'
import ListRooms from '@/components/ListRooms'
import Chat from '@/components/Chat'

Vue.use(VueRouter)

  const routes = [
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
    path: '/chat',
    name: 'Chat',
    component: Chat
  }
]

const router = new VueRouter({
  routes
})

export default router
