<template>
  <div class="app container">
    <button class="btn" @click="createRoom">New Room</button>
    <div v-for="room in rooms" :key="room._id">
      <button class="btn btn-lg" @click="joinRoom(room)">{{ room.name }}</button>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";

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
    joinRoom(room) {
      const id = room._id;
      console.log("joining room...");
      this.$socket.emit("subscribe", {
        room: id,
        user: this.user,
      });

      store.dispatch("Room/JOIN_ROOM", id);

      router.push({ name: "Chat", params: { roomTitle: room.name } });
    },

    createRoom() {
      router.push({ name: "NewRoom" });
    },
  },
};
</script>