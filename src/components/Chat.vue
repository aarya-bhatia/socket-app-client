<template>
  <div class="app">
    <div v-if="!connected">You are not connected to the server...</div>
    
    <button @click="leaveRoom">Leave Room</button>

    <form @submit.prevent="sendMessage">
      <div class="input-field col s12">
        <label for="message">Type Message...</label>
        <input name="message" type="text" v-model="content" />
      </div>
    </form>

    <!-- chat messages -->
    <h4>Messages</h4>
    <div v-for="(message, i) in messages" :key="i">{{ message.user }} -> {{ message.content }}</div>
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Chat",

  data() {
    return {
      content: "",
    };
  },

  computed: {
    ...mapGetters({
      connected: "isConnected",
      messages: "Room/messages",
      roomName: "Room/roomName",
      user: "Room/user",
    }),
  },

  methods: {
    ...mapActions({
      LEAVE_ROOM: "Room/LEAVE_ROOM",
    }),

    leaveRoom() {
      this.$socket.emit("unsubscribe", {
        room: this.roomName,
        user: this.user,
      });

      this.LEAVE_ROOM();
    },

    sendMessage() {
      this.$socket.emit("new message", {
        room: this.roomName,
        user: this.user,
        content: this.content,
      });

      this.content = "";
    },
  },
};
</script>
