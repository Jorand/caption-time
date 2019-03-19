<template>
  <div class="search">
    <form @submit="searchSubtitles" class="search-container">
      <input autofocus type="text" name="searchQuery" class="search-input"
      placeholder="Game of Thrones S01E01 /eng …"
      v-model="searchQuery"
      @focus="show_info = true"
      @blur="show_info = false">
      <input type="submit" value="submit" class="search-btn">
      <span class="tips" v-show="show_info">Tips: /eng or /english override your default language.</span>
    </form>
  </div>
</template>

<script>
import Caption from 'caption-core'
import Languages from '@/lib/languages'

function searchLangInQuery (query) {
  var languagesString = Languages.map(e => e.name).join('|/') + '|/' + Languages.map(e => e.code).join('|/')
  var regex = new RegExp(`(/${languagesString})$`, 'gi')
  var found = query.match(regex)

  if (found) {
    found = found[0].toLowerCase().replace('/', '')
    var language = Languages.find(l => l.name.toLowerCase() === found) || Languages.find(l => l.code === found)
    console.log('[INFO] Query match language:', found, language.name)
    return language.code
  }
}

export default {
  name: 'SearchInput',
  props: ['query'],
  data () {
    return {
      searchQuery: '',
      searchResult: [],
      show_info: false
    }
  },
  methods: {
    searchSubtitles (e) {
      if (e) e.preventDefault()
      // Search Logic
      if (!this.searchQuery) {
        return
      }

      const LIMIT = 10 // "all" "best"
      var LANG = searchLangInQuery(this.searchQuery) || this.$store.state.userSettings.language

      Caption.searchByQuery(this.searchQuery, LANG, LIMIT)
        .on('fastest', subtitles => {
          // Fastest source has been checked.
          console.log('[INFO] Fastest search result:', subtitles)
          this.searchResult = subtitles
          this.$emit('search-result', this.searchResult)
        })
        .on('completed', subtitles => {
          // All sources are checked.
          console.log('[INFO] Completed search result:', subtitles)
          this.searchResult = subtitles
          this.$emit('search-result', this.searchResult)
        })
    }
  },
  computed: {},
  watch: {
    query: function (newVal, oldVal) { // watch it
      console.log('[INFO] Prop changed:', newVal, '| was:', oldVal)
      if (newVal && newVal !== this.searchQuery) {
        this.searchQuery = newVal
        this.searchSubtitles()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    padding: 12px 25px;

    .tips {
      position: absolute;
      font-size: 11px;
      line-height: 1em;
      color: $grey-color;
      display: inline-block;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 3px;
      display: none;
    }

    .search-container {
      position: relative;

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 9px;
        left: 10px;
        width: 15px;
        height: 15px;
        border: 2px solid $grey-color;
        border-radius: 50%;
        background-color: white;
        pointer-events: none;
      }

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 15px; // +6
        left: 15px;
        width: 2px;
        height: 17px;
        background-color: $grey-color;
        transform: rotate(-45deg);
        transform-origin: top left;
        pointer-events: none;
      }
    }

    .search-input {
      font-size: 14px;
      border: 1px solid $grey-color;
      border-radius: 18px;
      height: 36px;
      line-height: 36px;
      width: 100%;
      padding: 0 10px;
      padding-left: 35px;

      &::placeholder {
        color: $grey-color
      }
    }

    .search-btn {
      position: absolute;
      top: 0px;
      left: 0px;
      border-radius: 50% 0 0 50%;
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      opacity: 0;
    }
  }
</style>
