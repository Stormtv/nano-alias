<template>
<div class="container">
  <h1>Blockchain Tools</h1>
  <div class="lookup">
    <form action="/en/explore/chain">
      <input class="lookup__input text" value="" name="block" placeholder="Enter a transaction hash or a Nano address">
      <button class="button lookup__button">Search chain</button>
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
