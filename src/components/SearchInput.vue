<template>
  <div class="search">
    <form @submit="searchSubtitles" class="search-form">
      <input autofocus type="text" placeholder="Enter show or movie name…"
      name="search-input" class="search-input" ref="searchInput"
      v-model="query"
      @keydown.enter="onEnter" />
      <i class="icon-search"></i>
      <button type="reset" name="reset" value="Reset" class="search-reset icon-cross"
        @click.stop="reset">
      </button>
    </form>
  </div>
</template>

<script>
import Caption from 'caption-core'
import Languages from '@/lib/languages'
import Network from '@/lib/network'
const electron = require('electron')
const remote = electron.remote
const mainWindow = remote.getCurrentWindow()
const { dialog } = remote
// Number of subtitles returned.
// Option: int|"all"|"best"
const LIMIT = 10

export default {
  name: 'SearchInput',
  props: ['remoteQuery'],
  data () {
    return {
      query: 'supergirl S01E01',
      lastQuery: '',
      isLoading: false,
      searchResult: [],
      tempSearchResult: [],
      nothingFound: false,
      timeoutSearch: null
    }
  },
  methods: {
    searchLangInQuery (q) {
      // Look in the Query for /[lang|code]
      // Override user setting
      var langStr = Languages.map(e => e.name).join('|/') + '|/' + Languages.map(e => e.code).join('|/')
      var match = q.match(new RegExp(`(/${langStr})$`, 'gi'))

      if (match) {
        match = match[0].toLowerCase().replace('/', '') // Remove /
        var language = Languages.find(l => l.name.toLowerCase() === match) || Languages.find(l => l.code === match)
        console.log('[INFO] Query match language:', match, language.name)
        return language.code
      }
    },
    updateSubtitles (subtitles) {
      this.$emit('search-result', subtitles)
    },
    searchSubtitles (event) {
      if (event) event.preventDefault() // Prevent form submit
      if (!this.query) return // Do nothing empty query

      if (!Network.isOnline(this.searchSubtitles)) return

      // Use language in query or stored user setting language
      var LANG = this.searchLangInQuery(this.query) || this.$store.state.userSettings.language

      console.log('[INFO] searchByQuery:', this.query)
      this.startLoader()
      this.tempSearchResult = []
      this.searchResult = []
      this.lastQuery = this.query
      this.nothingFound = false

      const pushSubtitles = (subtitles, source) => {
        // add lang to subtitle object
        subtitles = subtitles.filter(function (item) {
          item.langCode = LANG
          item.lang = item.subInfo ? item.subInfo.lang : ''
          item.langName = item.lang ? item.lang : Languages.find(l => l.code === LANG).name
          item.lang = item.subInfo ? item.subInfo.lang : ''
          item.langId = item.subInfo ? item.subInfo.langId : ''
          item.downloads = item.subInfo ? item.subInfo.downloads : ''
          item.distribution = item.subInfo ? item.subInfo.distribution : ''
          item.team = item.subInfo ? item.subInfo.team : ''
          item.version = item.subInfo ? item.subInfo.version : ''
          item.episodeTitle = item.subInfo ? item.subInfo.episodeTitle : ''
          item.hearingImpaired = item.subInfo ? item.subInfo.hearingImpaired : ''
          item.resultSearchGroup = source
          return item
        })
        this.tempSearchResult = subtitles

        if (source === 'completed') {
          this.endLoader()
        }
      }

      clearTimeout(this.timeoutSearch)
      this.timeoutSearch = setTimeout(() => {
        this.endLoader()
      }, 10000)

      Caption.searchByQuery(this.query, LANG, LIMIT)
        // All sources are checked.
        .on('fastest', subtitles => {
          // Fastest source has been checked.
          console.log('[INFO] Fastest search result:', subtitles)
          pushSubtitles(subtitles, 'fastest')
        })
        .on('completed', subtitles => {
          console.log('[INFO] Completed search result:', subtitles)
          // setTimeout(() => {
          pushSubtitles(subtitles, 'completed')
          // }, 5000)
        })
    },
    reset () {
      this.lastQuery = this.query = ''
      this.nothingFound = false
      this.searchResult = []
      this.$refs.searchInput.focus()
    },
    startLoader () {
      this.isLoading = true
    },
    endLoader () {
      this.searchResult = this.tempSearchResult
      clearTimeout(this.timeoutSearch)
      this.nothingFound = this.searchResult.length < 1
      this.isLoading = false
    },
    onEnter (event) {
      event.preventDefault()
      // If query hase change: Send Query
      // console.log(this.query, this.lastQuery)
      if (this.query === '') {
        this.reset()
      } else if (this.query !== this.lastQuery) {
        this.searchSubtitles()
      }
    },
    openFile (file) {
      console.log(file)
      if (!mainWindow) return
      var opts = {
        title: 'Select a file.',
        filters: [{ name: 'Movie File', extensions: ['mkv', 'avi', 'mp4'] }],
        properties: [ 'openFile' ]
      }
      dialog.showOpenDialog(mainWindow, opts, function (selectedPaths) {
        console.log(selectedPaths)
        if (!Array.isArray(selectedPaths)) return
        selectedPaths.forEach(function (selectedPath) {

        })
      })
    }
  },
  computed: {},
  watch: {
    nothingFound: function (newVal, oldVal) {
      // console.log('search nothingFound', newVal);
      this.$emit('search-nothing-found', newVal)
    },
    isLoading: function (newVal, oldVal) {
      // console.log('search loading', newVal);
      this.$emit('search-loading', newVal)
    },
    searchResult: function (newVal, oldVal) {
      // console.log('[WATCH] Search result:', newVal, '| was:', oldVal)
      this.updateSubtitles(this.searchResult)
    },
    remoteQuery: function (newVal, oldVal) { // watch it
      console.log('[WATCH] Remote query:', newVal, '| was:', oldVal)
      if (newVal && newVal !== this.query) {
        this.query = newVal
        this.searchSubtitles()
      }
    }
  },
  mounted () {
    electron.ipcRenderer.on('openFile', (event, file) => {
      console.log(event, file)
      this.openFile(file)
    })

    this.$store.subscribe((mutation, state) => {
      // console.log(mutation, state)
      switch (mutation.type) {
        case 'setUserLanguage':
          this.searchSubtitles()
          break
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: relative;
    padding: 12px 25px;

    .search-form {
      position: relative;
    }

    .search-input {
      font-size: 14px;
      border: 1px solid $grey-color;
      border-radius: 18px;
      height: 36px;
      line-height: 36px;
      width: 100%;
      padding: 0 25px 0 35px;

      &::placeholder {
        color: $grey-color
      }
    }

    .icon-search {
      position: absolute;
      top: 0px;
      left: 0px;
      border-radius: 50% 0 0 50%;
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      overflow: hidden;
      text-indent: 200%;
      white-space: nowrap;
      color: $grey-color;
    }

    .search-reset {
      position: absolute;
      top: 50%;
      right: 7px;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      border: none;
      color: $grey-color;

      &:hover, &:focus {
        color: $text-color;
      }
    }
  }
</style>
