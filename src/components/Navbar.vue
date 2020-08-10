<template>
  <nav class="teal">
    <div class="nav-wrapper container">
      <a class="left">
        <i class="material-icons large">home</i>
      </a>
      <ul class="right">
        <li>
          <a href>
            <i class="material-icons large">account_circle</i>
          </a>
        </li>

        <li>
          <a href>
            <i class="material-icons large">group</i>
          </a>
        </li>

        <li>
          <router-link :to="{ name: 'Logout' }">
            <i class="material-icons large">exit_to_app</i>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>