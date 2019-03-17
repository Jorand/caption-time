<template>
  <div class="search">
    <form @submit="search">
      <input type="text" v-model="query" name="query" placeholder="Search an episode…">
      <input type="submit" value="submit" class="btn">
    </form>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      query: ''
    }
  },
  methods: {
    search(e) {
      e.preventDefault();
      // Search Logic
      console.log(this.query);
      
      const result = [
        {
          id: 10,
          name: "subtitle result 1.str",
          best: true
        }
      ];
      
      // Send to parent
      this.$emit('search-result', result);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
