<template>
  <div id="app">
    <header id="header">
      <div class="nav-wrap">
        <div class="container">
          <nav class="cf">
            <a href="/"><img class="logo" src="./assets/img/logo.png" alt="canoe" height="29"></a>
            <ul>
              <li><a href="/request">Register</a></li>
              <li><a href="/aliases">Directory</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
</style>