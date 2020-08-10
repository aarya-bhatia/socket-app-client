<template>
  <div class="container">
    <div class="progress" v-if="fetching">
      <div class="indeterminate"></div>
    </div>

    <!-- chat messages -->
    <h4>{{ roomTitle }}</h4>
    <div class="card-panel">
      <div class="collection messages" v-chat-scroll>
        <div class="collection-item" v-for="(message, i) in messages" :key="i">
          <span class="sender">{{ message.user }} -></span>
          <span class="content">{{ message.content }}</span>
          <span class="secondary-content">{{ message.time }}</span>
        </div>
        <div class="collection-item">{{ info }}</div>
      </div>
    </div>

    <form @submit.prevent="sendMessage">
      <div class="input-field col s12">
        <label for="message">Type Message...</label>
        <input name="message" type="text" v-model="content" />
        <button class="btn">Send</button>
      </div>
    </form>

    <p class="red-text" v-if="feedback">{{ feedback }}</p>
    <button class="btn" @click="leaveRoom">Exit</button>
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters, mapActions } from "vuex";
import router from "@/router";
import moment from "moment";

export default {
  name: "Chat",

  data() {
    return {
      fetching: true,
      feedback: null,
      content: "",
      usersTyping: [],
    };
  },

  props: ["roomTitle"],

  async created() {
    await store.dispatch("Room/FETCH_MESSAGES");
    this.fetching = false;

    window.addEventListener("beforeunload", this.leaveRoom);
  },

  sockets: {
    USER_TYPING(payload) {
      const status = payload.status;
      if (status) {
        // add user to typing stack
        let stack = [];
        this.usersTyping.forEach((user) => {
          if (user !== payload.user) {
            stack.push(user);
          }
        });
        stack.push(payload.user);
        this.usersTyping = stack;
      } else {
        // remove user from typing stack
        let stack = [];
        this.usersTyping.forEach((user) => {
          if (user !== payload.user) {
            stack.push(user);
          }
        });
        this.usersTyping = stack;
      }
    },
  },

  computed: {
    ...mapGetters({
      messages: "Room/messages",
      roomName: "Room/roomName",
      user: "Room/user",
    }),

    typingStackLength() {
      return this.usersTyping.length;
    },
    info() {
      return this.typingStackLength > 0
        ? `${this.usersTyping[this.typingStackLength - 1]} is typing...`
        : "";
    },
  },

  methods: {
    ...mapActions({
      LEAVE_ROOM: "Room/LEAVE_ROOM",
      SEND_MESSAGE: "Room/SEND_MESSAGE",
      FETCH_MESSAGES: "Room/FETCH_MESSAGES",
    }),

    leaveRoom() {
      this.$socket.emit("unsubscribe", {
        room: this.roomName,
        user: this.user,
      });

      this.LEAVE_ROOM();

      router.push({ name: "ListRooms" });
    },

    async sendMessage() {
      try {
        const message = await this.SEND_MESSAGE({
          room: this.roomName,
          user: this.user,
          content: this.content,
          time: moment().format("ddd, hh:mm A"),
        });

        this.$socket.emit("new message", message);
      } catch (err) {
        console.log(err.message);
      }

      this.content = "";
    },

    emitUserTypingEvent(status) {
      this.$socket.emit("user typing", {
        user: this.user,
        room: this.roomName,
        status: status,
      });
    },
  },

  watch: {
    content() {
      if (this.content) {
        if (!this.usersTyping.includes(this.user)) {
          setTimeout(() => {
            this.emitUserTypingEvent(true);
          }, 1000);
        }
      } else {
        setTimeout(() => {
          this.emitUserTypingEvent(false);
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>
.messages {
  height: 300px;
  overflow: scroll;
}
</style>