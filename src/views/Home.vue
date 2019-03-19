<template>
  <div class="home flex-container">
    <SearchInput
      v-on:search-result="updateList"
      v-bind:query="externalQuery" />
    <ButterPlaying v-on:title-playing="searchFromButter" />
    <div class="flex-content">
      <Subtitles v-bind:subtitles="subtitleList" />
    </div>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput.vue'
import Subtitles from '@/components/Subtitles.vue'
import ButterPlaying from '@/components/ButterPlaying.vue'

export default {
  name: 'Home',
  components: {
    SearchInput,
    Subtitles,
    ButterPlaying
  },
  data () {
    return {
      subtitleList: [],
      externalQuery: ''
    }
  },
  methods: {
    updateList (result) {
      // const { title, id } = result
      // this.subtitles = [...this.subtitles, result];
      this.subtitleList = result
    },
    searchFromButter (title) {
      this.externalQuery = title
    }
  }
}
</script>

<style lang="scss" scoped>
  .home {
    position: relative;
  }
  .home-content {
    flex: 1; /* takes the remaining height of the "container" div */
    overflow: auto;
  }
</style>
