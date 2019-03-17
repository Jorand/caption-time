<template>
  <div class="subtitles">
    <div v-bind:key="subtitle.id" v-for="subtitle in subtitles">
      <h3>{{ subtitle.name }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "Subtitles",
  props: ["subtitles"]
}
</script>

<style lang="scss" scoped>
  
</style>
