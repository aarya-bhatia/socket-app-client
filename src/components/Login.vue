<template>
  <div class="login container">
    <form class="col s12" @submit.prevent="login">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">account_circle</i>
          <input type="text" v-model="username" placeholder="Email" />
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">vpn_key</i>
          <input type="password" v-model="password" placeholder="Password" />
        </div>
        <p class="red-text" v-if="feedback">{{ feedback }}</p>
        <div class="input-field col s12">
          <button type="submit" class="btn">Login</button>
        </div>
        <div class="input-field col s12">
          <a href>Create an account</a>
        </div>
        <div class="input-field col s12">
          <a href class="grey-text">Forgot Password?</a>
        </div>
      </div>
    </form>

    <div class="progress" v-if="fetching">
      <div class="indeterminate"></div>
    </div>
  </div>
</template>

<script>
import store from "../store";

export default {
  name: "Login",

  data() {
    return {
      username: "",
      password: "",
      feedback: "",
      fetching: false,
    };
  },

  methods: {
    async login() {
      if (!this.username) {
        this.feedback = "Please enter a username";
        return;
      }

      if (!this.password) {
        this.feedback = "Please enter a password";
        return;
      }

      this.feedback = "";

      try {
        this.fetching = true;
        const user = await store.dispatch("Auth/LOGIN", {
          username: this.username,
          password: this.password
        });
        await store.dispatch("Room/SET_USER", user.username)
        await store.dispatch("Room/FETCH_ROOM_DATA", user.rooms);
        this.fetching = false;
      } catch (err) {
        this.feedback = err.message;
      }
    },
  },
};
</script>

<style>
.login form {
  padding: 20px;
  margin-top: 20px;
}
.login {
  width: 50%;
  text-align: center;
}
</style>
