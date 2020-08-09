<template>
  <div class="app container">
    <div v-for="room in rooms" :key="room._id">
      <a @click.prevent="joinRoom(room._id)">{{ room.name }}</a>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "ListRooms",

  computed: {
    rooms() {
      return store.getters["Room/rooms"];
    },

    user() {
      return store.getters["Room/user"];
    },
  },

  methods: {
    joinRoom(id) {
      console.log("joining room...");
      this.$socket.emit("subscribe", {
        room: id,
        user: this.user,
      });

      store.dispatch("Room/JOIN_ROOM", {
        roomName: id,
        user: this.user,
      });

      this.$emit('chat');
    },
  },
};
</script>