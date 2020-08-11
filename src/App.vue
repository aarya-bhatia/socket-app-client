<template>
  <div id="app">
    <Navbar />
    <button class="btn brown lighten-3" @click="totalConnections">Get total connections</button>
    <br />
    <div v-if="!isConnected">Connecting To Server...</div>
    <router-view />
  </div>
</template>

<script>
import store from "@/store";
import Navbar from "@/components/Navbar";

export default {
  name: "App",
  components: { Navbar },
  computed: {
    isConnected() {
      return store.getters.isConnected;
    },
  },
  methods: {
    totalConnections() {
      this.$socket.emit("get connections");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
