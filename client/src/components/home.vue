<template>
<div class="container wallet">
  <div class="grid">
    <div class="col w-1-3"><img src="@/assets/img/register.svg" class="wallet__icon">
      <h2>Register an Alias</h2>
      <p>An alias will allow people to send you Nano using @username rather than an xrb address.</p>
      <p><a href="/register" class="button button--primary">Register an Alias</a></p>
    </div>
    <div class="col w-1-3"><img src="@/assets/img/directory.svg" class="wallet__icon">
      <h2>View all Aliases</h2>
      <p>See the directory of all publicly registered aliases. Only public aliases are shown.</p>
      <p><a href="/aliases" class="button button--primary">View all Aliases</a></p>
    </div>
    <div class="col w-1-3"><img src="@/assets/img/ticket.svg" class="wallet__icon">
      <h2>Submit a Ticket</h2>
      <p>Did someone take your company's alias? Want to register a short alias?</p>
      <p><a href="/ticket" target="_blank" class="button button--primary">Submit a Ticket</a></p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      msg: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
