<template>
  <div>You have been logged out!</div>
</template>

<script>
import store from "@/store";

export default {
  name: "Logout",

  beforeCreate() {
    store.dispatch("Auth/LOGOUT");
  },
};
</script>