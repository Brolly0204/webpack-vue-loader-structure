<template>
  <div class="example">
    <h3 class="title">{{ msg }}</h3>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello Vue!'
    }
  }
}
</script>

<style lang="stylus" scoped>
.example
  .title
    color red
</style>
