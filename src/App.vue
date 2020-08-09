<template>
  <div id="app">
    <div v-if="!isConnected">Connecting To Server...</div>

    <div v-if="!joinedRoom">
      <form @submit.prevent="joinRoom">
        <label>Enter Room Name</label>
        <input type="text" placeholder="room id" v-model="roomName" />
        <br />
        <label>Enter User Name</label>
        <input type="text" v-model="user" />
        <button type="submit">OK</button>
      </form>
    </div>

    <div v-else>
      <button @click="leaveRoom">Leave Room</button>

      <form @submit.prevent="sendMessage">
        <label>Type Message...</label>
        <input type="text" v-model="content" />
        <button type="submit">Send</button>
      </form>

      <!-- chat messages -->
      <div v-for="(message, i) in messages" :key="i">{{ message.user }} -> {{ message.content }}</div>
    </div>
  </div>
</template>

<script>
import store from "./store";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {
      user: "",
      roomName: "",
      content: "",
    };
  },

  computed: {
    ...mapGetters(["isConnected", "joinedRoom", "messages"]),
  },

  methods: {
    ...mapActions(["JOIN_ROOM", "LEAVE_ROOM"]),

    joinRoom() {
      console.log("joining room...");
      this.$socket.emit("subscribe", {
        room: this.roomName,
        user: this.user,
      });

      this.JOIN_ROOM({
        roomName: this.roomName,
        user: this.user,
      });
    },

    leaveRoom(state) {
      this.$socket.emit("unsubscribe", {
        room: store.state.roomName,
        user: store.state.user,
      });

      this.LEAVE_ROOM();
    },

    async sendMessage() {
      this.$socket.emit("new message", {
        room: store.state.roomName,
        user: store.state.user,
        content: this.content,
      });

      this.content = "";
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
  margin-top: 60px;
}
</style>
