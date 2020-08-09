<template>
  <div class="row">
    <form @submit.prevent>
      <!-- Room name -->
      <div class="input-field col s12">
        <label for="name">Name</label>
        <input type="text" v-model="name" />
      </div>

      <!-- Search for users to add -->
      <div class="input-field col s12">
        <input id="search" type="search" required v-model="search" />
        <label class="label-icon" for="search">
          <i class="material-icons">search</i>
        </label>
        <i class="material-icons">close</i>
      </div>

      <p class="red-text" v-if="feedback">{{ feedback }}</p>
    </form>

    <p v-if="members.length === 0" class="grey-text">Group does not have any members yet!</p>

    <!-- search results -->
    <div class="progress" v-if="fetchingUsers">
      <div class="indeterminate"></div>
    </div>

    <div class="searchResults" v-for="user in found" :key="user._id">
      <span>{{ user.username }}</span>
      <button @click="addMember(user)" class="btn">
        <i class="material-icons">add_circle</i>
      </button>
    </div>

    <h4>Members</h4>
    <div class="collection">
      <div class="collection-item" v-for="(member,i) in members" :key="i">
        <span>{{ member }}</span>
        <button class="btn">
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

export default {
  name: "NewRoom",
  data() {
    return {
      name: "",
      search: "",
      found: [],
      members: [],
      fetchingUsers: false,
      feedback: null
    };
  },
  watch: {
    search() {
      setTimeout(async () => {
        this.fetchingUsers = true;
        await axios
          .get(store.state.api + "/users/search?val=" + this.search)
          .then(result => {
            this.found = result.data;
            this.fetchingUsers = false;
            this.feedback = null;
          })
          .catch(err => {
            this.feedback = err.response.data;
          });
      }, 1000);
    }
  },
  computed: {
      user() {
        return store.state.user
      }
  },
  methods: {
    addMember(user) {
      this.members.push(user.username);
    },
    createRoom(){
        if(!this.name) {
            this.feedback = "Please enter a name for this room"
            return
        } 
        
        store.dispatch('createRoom', {
            admin: this.user.username,
            members: this.members,
            name: this.name
        }).then(() => {
            this.$router.push({ name: 'Chat' })
        })
    }
  }
};
</script>