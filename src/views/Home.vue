<template>
  <div class="home flex-container">
    <ButterPlaying v-on:title-playing="searchFromButter" />
    <SearchInput
      v-on:search-result="updateSubtitles"
      v-on:arrow-navigation="updatePosition"
      v-on:arrow-enter="enter"
      v-bind:remoteQuery="externalQuery" />
    <div class="flex-content" ref="container">
      <Subtitles
        v-bind:subtitles="subtitlesList"
        v-bind:arrowNavPosition="arrowNavPosition"
        v-bind:arrowNavEnter="arrowNavEnter" />
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
      subtitlesList: [],
      externalQuery: '',
      arrowNavPosition: -1,
      arrowNavEnter: 0
    }
  },
  methods: {
    updateSubtitles (subtitles) {
      // const { title, id } = result
      // this.subtitles = [...this.subtitles, result];
      this.subtitlesList = subtitles
    },
    searchFromButter (title) {
      this.externalQuery = title
    },
    updatePosition (pos) {
      this.arrowNavPosition = pos
    },
    enter (time) {
      this.arrowNavEnter = time
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
