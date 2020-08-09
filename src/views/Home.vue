<template>
  <div id="app">
    
    <div v-if="!isLoggedIn">
      <Login />
    </div>
    <div v-else>
      <ListRooms v-if="!joinedRoom" />
      <Chat v-else />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import Login from '@/components/Login';
import ListRooms from '@/components/ListRooms';
import Chat from '@/components/Chat';

export default {
  name: "App",
  computed: {
    isConnected() {
      return store.getters.isConnected;
    },
    isLoggedIn() {
      return store.getters["Auth/isLoggedIn"];
    },
    joinedRoom() {
      return store.getters["Room/joinedRoom"];
    }
  },
  components: {
    Login,
    ListRooms,
    Chat
  }
};
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
