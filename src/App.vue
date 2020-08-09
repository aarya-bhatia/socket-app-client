<template>
  <div id="app">
    <input type="text" placeholder="name" v-model="user" />

    <div v-if="!joinedRoom">
      <input type="text" placeholder="room id" v-model="roomName">
      <button @click="joinRoom">Join Room</button>
    </div>
    <div v-else>
      <button @click="leaveRoom">Leave Room</button>

      <form @submit.prevent="sendMessage">
        <input type="text" placeholder="type here..." v-model="content" />
      </form>

      <div v-for="(message, i) in messages" :key="i">{{ message.user }} -> {{ message.content }}</div>
    </div>

    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      user: "",
      joinedRoom: false,
      roomName: "HomeRoom",
      message: "",
      content: "",
      messages: [],
    };
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    USER_JOINED(user) {
      this.message = user + " joined room " + this.roomName + '!';
      this.joinedRoom = true;
    },
    USER_LEFT(user) {
      this.message = user + " left room " + this.roomName + '!';
      this.joinedRoom = false;
    },
    NEW_MESSAGE({ user, content }) {
      this.message = user + " sent a message!"
      this.messages.push({ user, content })
    }
  },
  methods: {
    joinRoom() {
      this.$socket.emit("subscribe", {
        room: this.roomName,
        user: this.user,
      });
    },
    leaveRoom() {
      this.$socket.emit("unsubscribe", {
        room: this.roomName,
        user: this.user,
      });
    },
    sendMessage() {
      this.$socket.emit("new message", {
        room: this.roomName,
        user: this.user,
        content: this.content,
      });
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
