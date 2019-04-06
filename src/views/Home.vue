<template>
  <div tabindex="0" class="home flex-container"
    @focus="focus"
    @blur="blur"
    @keydown.down="onArrowDown"
    @keydown.up="onArrowUp"
    @keydown.enter="onEnter"
    :class="{hover: dragover}"
    @drop.prevent="loadFiles"
    @dragend.prevent
    @dragover.prevent="dragOverHandler"
    @dragleave.prevent="dragOverHandler">
    <ButterPlaying
      v-if="butterIsEnable"
      v-on:title-playing="searchFromButter"
      v-bind:updateButterSettings="newButterSettings" />
    <SearchInput
      v-on:search-result="updateSubtitles"
      v-on:search-loading="searchIsLoading"
      v-on:search-nothing-found="searchNothingFound"
      v-bind:remoteQuery="externalQuery" />
    <div class="flex-content home-content">
      <Subtitles
        v-bind:subtitles="subtitlesList"
        v-bind:arrowNavPosition="arrowNavPosition"
        v-bind:arrowNavEnter="arrowNavEnter"
        v-bind:search_isLoading="search_isLoading"
        v-bind:nothingFound="search_nothingFound" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      newButterSettings: {},
      search_isLoading: false,
      search_nothingFound: false,
      dragover: false,
      filePaths: []
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
    blur (event) {
      this.arrowNavPosition = -1
    },
    onArrowDown (event) {
      if (event) event.preventDefault()
      if (this.arrowNavPosition < this.subtitlesList.length - 1 && this.subtitlesList.length) {
        this.arrowNavPosition++
      }
    },
    onArrowUp (event) {
      if (event) event.preventDefault()
      if (this.arrowNavPosition > 0) {
        this.arrowNavPosition--
      }
    },
    onEnter (event) {
      if (event) event.preventDefault()
      // If query hase change: Send Query
      // console.log(this.query, this.lastQuery)
      this.arrowNavEnter = Date.now()
    },
    searchIsLoading (value) {
      this.search_isLoading = value
    },
    searchNothingFound (value) {
      this.search_nothingFound = value
    },
    dragOverHandler (event) {
      event.preventDefault()
      this.dragover = event.type === 'dragover'
    },
    loadFiles (event) {
      console.log('File(s) dropped')
      event.preventDefault()
      this.dragover = false
      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            var file = event.dataTransfer.items[i].getAsFile()
            console.log('... file[' + i + '].name = ' + file.name)
            this.filePaths.push({
              filename: file.name,
              path: file.path
            })
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var j = 0; j < event.dataTransfer.files.length; j++) {
          const file = event.dataTransfer.files[j]
          console.log('... file[' + j + '].name = ' + file.name)
          this.filePaths.push({
            filename: file.name,
            path: file.path
          })
        }
      }
      console.log(this.filePaths[0].filename)
      this.externalQuery = this.filePaths[0].filename
      this.filePaths = []
      // var LANG = this.$store.state.userSettings.language
      // console.log(this.filePaths, LANG)
      // Caption.searchByFiles(
      //   this.filePaths,
      //   LANG,
      //   'best'
      // ).on('completed', subtitles => {
      //   console.log(subtitles)
      //   this.updateSubtitles(subtitles)
      // })
    }
  },
  computed: {
    ...mapState({
      butterIsEnable: state => state.userSettings.butter.enable
    })
  }
}
</script>

<style lang="scss" scoped>
  .home {
    position: relative;

    &.hover {
      background-color: rgba(0,0,0,0.2);
    }
  }
  .home-content {
    flex: 1; /* takes the remaining height of the "container" div */
    overflow: hidden;
  }
</style>
