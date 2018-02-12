<template>
  <header id="header">
    <div class="nav-wrap">
      <div class="container">
        <nav class="cf">
          <a href="/"><img class="logo" src="@/assets/img/logo.png" alt="canoe" height="29"></a>
          <ul>
            <li><a v-on:click="makeActive('home')" v-bind:class="{active : isActiveTab('home')}" href="/">Home</a></li>
            <li><a v-on:click="makeActive('register')" v-bind:class="{active : isActiveTab('register')}" href="/register">Register</a></li>
            <li><a v-on:click="makeActive('directory')" v-bind:class="{active : isActiveTab('directory')}" href="/aliases">Directory</a></li>
            <li><a v-on:click="makeActive('support')" v-bind:class="{active : isActiveTab('support')}" href="/support">Support</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'header',
  data(data) {
    return {
      choice: this.choice
    }
  },
  methods: {
    makeActive: function(val) {
      this.choice = val;
    },
    isActiveTab: function(val) {
      return this.choice === val;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
