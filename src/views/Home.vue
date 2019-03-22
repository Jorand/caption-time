<template>
  <div tabindex="0" class="home flex-container"
    @focus="focus"
    @keydown.down="onArrowDown"
    @keydown.up="onArrowUp"
    @keydown.enter="onEnter">
    <ButterPlaying
      v-if="butterRemoteIsEnable"
      v-on:title-playing="searchFromButter"
      v-bind:updateButterSettings="newButterSettings" />
    <SearchInput
      v-on:search-result="updateSubtitles"
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
import { mapGetters } from 'vuex'
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
      arrowNavEnter: 0,
      newButterSettings: {}
    }
  },
  methods: {
    updateSubtitles (subtitles) {
      // const { title, id } = result
      // this.subtitles = [...this.subtitles, result];
      this.arrowNavPosition = -1
      this.subtitlesList = subtitles
    },
    searchFromButter (title) {
      this.externalQuery = title
    },
    focus (event) {
      if (this.arrowNavPosition < 0) {
        this.onArrowDown()
      }
    },
    onArrowDown (event) {
      if (this.arrowNavPosition < this.subtitlesList.length - 1 && this.subtitlesList.length) {
        this.arrowNavPosition++
      }
    },
    onArrowUp (event) {
      if (this.arrowNavPosition > 0) {
        this.arrowNavPosition--
      }
    },
    onEnter (event) {
      event.preventDefault()
      // If query hase change: Send Query
      // console.log(this.query, this.lastQuery)
      this.arrowNavEnter = Date.now()
    }
  },
  computed: {
    ...mapGetters([
      'butterRemoteIsEnable'
    ])
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
