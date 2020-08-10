<template>
  <div class="row container">
    <!-- Room name -->
    <div class="input-field col s12">
      <label for="name">Name</label>
      <input name="name" type="text" v-model="name" />
    </div>

    <!-- Search for users to add -->

    <div class="input-field col s12">
      <label for="search">
        <i class="material-icons">search</i>
      </label>
      <input name="search" type="text" v-model="search" />
    </div>

    <p class="red-text" v-if="feedback">{{ feedback }}</p>

    <p v-if="members.length === 0" class="grey-text">Group does not have any members yet!</p>

    <!-- search results -->
    <div class="progress" v-if="fetchingUsers">
      <div class="indeterminate"></div>
    </div>

    <div class="collection">
      <div class="collection-item" v-for="user in found" :key="user._id">
        <p>{{ user.username }}</p>
        <button @click="addMember(user)" class="btn">
          <i class="material-icons">add_circle</i>
        </button>
      </div>
    </div>

    <h4>Members</h4>
    <div class="collection">
      <div class="collection-item">
        <p>{{ user }} (You)</p>
      </div>
      <div class="collection-item" v-for="(member,i) in members" :key="i">
        <p>{{ member }}</p>
        <button class="btn" @click="removeMember(member)">
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>

    <p class="teal-text">When you're ready, continue to the room!</p>
    <button class="btn" @click="createRoom">continue</button>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";
import axios from "axios";

export default {
  name: "NewRoom",
  data() {
    return {
      name: "",
      search: "",
      found: [],
      members: [],
      fetchingUsers: false,
      feedback: null,
    };
  },
  watch: {
    search() {
      if (!this.search || this.search === "") return;
      setTimeout(async () => {
        await this.searchUsers();
      }, 1000);
    },
  },
  computed: {
    user() {
      return store.getters["Auth/username"];
    },
  },
  methods: {
    async searchUsers() {
      this.fetchingUsers = true;
      await axios
        .get(store.getters.api + "/users?search=" + this.search)
        .then((result) => {
          this.found = this.filterAddedUsersFromSearch(result.data);
          this.feedback = null;
        })
        .catch((err) => {
          this.feedback = err.response.data;
        });
      this.fetchingUsers = false;
    },

    filterAddedUsersFromSearch(data) {
      return data.filter((user) => {
        if (user.username === this.user) {
          return;
        }

        if (!this.members.includes(user.username)) {
          return user;
        }
      });
    },

    addMember(user) {
      this.members.push(user.username);
      this.found = this.filterAddedUsersFromSearch(this.found);
    },

    async removeMember(member) {
      this.members = this.members.filter((m) => {
        return m !== member;
      });
      await this.searchUsers();
    },

    createRoom() {
      if (!this.name) {
        this.feedback = "Please enter a name for this room";
        return;
      }

      this.members.push(this.user); // important

      let newroom = null;

      // create new room in db
      store
        .dispatch("Room/CREATE_ROOM", {
          admin: this.user.username,
          members: this.members,
          name: this.name,
        })
        .then((result) => {
          return new Promise((resolve, reject) => {
            if (result) {
              console.log("new room => ", newroom);
              newroom = result;
              resolve();
            } else {
              reject({ message: "failed to create new room" });
            }
          });
        })
        .then(() => {
          // register new room in db for each member
          store.dispatch("Auth/NEW_ROOM", newroom);
        })
        .then(() => {
          // informing online users to update rooms
          this.$socket.emit("new room", newroom);
        })
        .then(() => {
          // proceed current user to join the new room
          this.$socket.emit("subscribe", {
            room: newroom._id,
            user: this.user,
          });
          store.dispatch("Room/JOIN_ROOM", newroom._id);
        })
        .then(() => {
          // proceed to chats page
          router.push({ name: "Chat", params: { roomTitle: newroom.name } });
        })
        .catch((err) => {
          this.feedback = err.message;
        });
    },
  },
};
</script>