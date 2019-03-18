<template>
  <div class="search">
    <form @submit="searchSubtitles">
      <input type="text" v-model="searchQuery" name="searchQuery" placeholder="Search an episode…">
      <input type="submit" value="submit" class="btn">
    </form>
  </div>
</template>

<script>
import Caption from "caption-core";
const LANG = "eng";
const LIMIT = 10;

export default {
  name: "SearchInput",
  data() {
    return {
      searchQuery: '',
      searchResult: []
    }
  },
  methods: {
    searchSubtitles(e) {
      e.preventDefault();
      // Search Logic
      console.log(this.searchQuery);
      
      Caption.searchByQuery(this.searchQuery, LANG, LIMIT)
        .on("fastest", subtitles => {
          // Fastest source has been checked.
          console.log("fastest",subtitles);
          this.searchResult = subtitles;
          this.$emit('search-result', this.searchResult);
        })
        .on("completed", subtitles => {
          // All sources are checked.
          console.log("completed",subtitles);
          this.searchResult = subtitles;
          this.$emit('search-result', this.searchResult);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
