<template>
<div class="container">
  <h1>Register an Alias</h1>
  <div class="lookup">
    <form action="/en/explore/chain">
      <input class="lookup__input text" value="" name="block" placeholder="">
      <button class="button lookup__button">Create</button>
    </form>
  </div>
</div>
</template>

<script>
export default {
  name: 'register',
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
