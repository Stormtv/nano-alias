<template>
<div class="container">
  <h2>Register an Alias</h2>
  <div class="lookup">
    <form action="/en/explore/chain">
      <h3>Alias</h3>
      <input class="text" value="" name="block" placeholder="canoe">
      <h3>Email</h3>
      <input class="text" value="" name="email" placeholder="canoe@getcanoe.io">
      <h3>Nano Address</h3>
      <input class="text" value="" name="address" placeholder="xrb_1qckwc5o3obkrwbet4amnkya113xq77qpaknsmiq9hwq31tmd5bpyo7sepsw">
      <h3>Listed</h3>
      <label for="listed">Your alias will be publicly searchable and show up the directory. If you would like to have an alias to send to your friends but not everyone be able to see then this option is for you.</label>
      <input type="checkbox" value="" name="listed"></input><span>List my Alias</span>
      <button class="button">Create Alias</button>
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
  h3 {
    margin-bottom: 0px;
  }
  input[type="checkbox"] {
    box-shadow: none;
    display: inline-block;
    width: auto;
    margin-right: 6px;
  }
  .button {
    position: absolute;
    display: block;
    right: 0px;
  }
</style>
