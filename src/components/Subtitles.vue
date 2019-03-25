<template>
  <div class="subtitles-wrapper">
    <div class="event-toast loader" v-if="isLoading">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="event-toast nothing" v-if="nothingFound">
      Nothing found !
      <a href="" @click.prevent="subtitlecat">Try subtitlecat</a>
    </div>
    <div class="actionsBar" v-if="subtitlesList.length">
      <ul class="left">
        <li class="bar-item">
          <button type="button" name="show-all"
            :class="{active: activeFilter === 'all'}"
            @click="filterSubtitles('all')"
            @keydown.enter="filterSubtitles('all')"
            @focus="actionFocused = true"
            @blur="actionFocused = false">All</button>
        </li>
        <li class="bar-item" v-bind:key="`source-${i}`"
          v-show="sources.length > 1"
          v-for="(source, i) in sources">
          <button type="button" name="filter"
            :class="{active: activeFilter === source}"
            @click="filterSubtitles(source)"
            @keydown.enter="filterSubtitles(source)"
            @focus="actionFocused = true"
            @blur="actionFocused = false">{{source}}</button>
        </li>
      </ul>
      <div class="right">
        <div class="bar-item">
          <button class="button" type="button" name="download-all"
            @click="downloadAll()"
            @keydown.enter="downloadAll()"
            @focus="actionFocused = true"
            @blur="actionFocused = false">
            Download all
          </button>
        </div>
      </div>
    </div>
    <div class="subtitles-container" ref="containerSubtitlesScroll">
      <ol class="subtitles-list">
        <li class="item" ref="item" v-bind:key="`item-${i}`"
          v-for="(subtitle, i) in subtitlesList"
          :class="{ 'is-active': i === arrowNavPosition }"
          @click="download(subtitle)">
          <h3 class="item-name"
            @mouseover.stop="itemHover($event)"
            @mouseout.stop="itemWidth = 0">
            <span v-bind:style="{ left: '-' + calculateWidth + 'px' }">
              {{ subtitle.name }}
            </span>
          </h3>
          <ul class="item-meta">
            <li aria-label="source">{{ subtitle.source }}</li>
            <li aria-label="downloads" v-if="subtitle.subInfo">{{ subtitle.subInfo.downloads }} downloads</li>
            <li aria-label="score" v-if="subtitle.score !== 0">Rated: {{subtitle.score}}</li>
            <li aria-label="hearingImpaired" v-if="subtitle.hearingImpaired">SDH</li>
            <li aria-label="lang">{{ subtitle.langName }}</li>
          </ul>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import Caption from 'caption-core'
import _ from 'lodash'
import Network from '@/lib/network'
const { shell } = require('electron')
const remote = require('electron').remote
const { dialog, app } = remote
const mainWindow = remote.getCurrentWindow()

function uiError (msg, error) {
  console.log(error)
  dialog.showErrorBox('Oops! Something went wrong', msg + ': ' + error)
}

function map (val, inMin, inMax, outMin, outMax) {
  return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

export default {
  name: 'Subtitles',
  props: ['subtitles', 'arrowNavPosition', 'arrowNavEnter', 'search_isLoading', 'nothingFound'],
  data () {
    return {
      itemWidth: 0,
      subtitlesList: [],
      sources: [],
      actionFocused: false,
      activeFilter: 'all',
      isLoading: false
    }
  },
  methods: {
    notification: (message, saveFolder) => {
      console.log('[NOTIF]', message, saveFolder)
      const myNotification = new Notification(app.getName(), {
        body: message
      })
      myNotification.onclick = () => {
        console.log(saveFolder)
        shell.showItemInFolder(saveFolder)
      }
    },
    download (subtitle) {
      if (!Network.isOnline(() => { this.download(subtitle) })) return
      const hasExtension = subtitle.name.includes('.srt')
      let filename = hasExtension ? subtitle.name.replace(/.srt$|.str$/gi, '') : subtitle.name
      filename = `${filename}-${subtitle.langName}.srt`
      const savePath = dialog.showSaveDialog(mainWindow, {
        title: 'Download',
        properties: ['openDirectory'],
        defaultPath: filename
      })
      if (!savePath) return
      try {
        Caption.download(subtitle, subtitle.source, savePath)
          .then(() => {
            this.notification(`${filename} is successfully downloaded!`, savePath)
          })
          .catch(err => {
            console.log('[ERROR] download:', err)
            uiError('Download failed', err)
          })
      } catch (error) {
        uiError('Download failed', error)
      }
    },
    itemHover (e) {
      if (e.target.className === 'item-name') {
        var diff = e.target.firstChild.clientWidth - e.target.clientWidth
        this.itemWidth = diff > 0 ? diff : 0
      }
    },
    filterSubtitles (source) {
      this.activeFilter = source
      switch (source) {
        case 'all':
          this.subtitlesList = _.orderBy(this.subtitles, ['source', 'downloads', 'score'], ['asc', 'desc', 'desc'])
          break
        default:
          this.subtitlesList = _.orderBy(this.subtitles.filter((subtitle) => {
            return subtitle.source === source
          }), ['downloads', 'score'], ['desc', 'desc'])
      }
    },
    downloadAll () {
      if (this.subtitlesList.length < 1) return
      if (!Network.isOnline(this.downloadAll)) return
      let saveFolder = dialog.showOpenDialog(mainWindow, {
        title: 'Download',
        properties: ['openDirectory']
      })
      if (!saveFolder) return
      saveFolder = saveFolder[0]
      this.isLoading = true
      mainWindow.setProgressBar(0)
      let counter = 0
      const endDownload = (force = false, filePath = '') => {
        var p = map(counter + 1, 0, this.subtitlesList.length - 1, 0, 1)
        mainWindow.setProgressBar(p)
        if (counter >= this.subtitlesList.length - 1 || force) {
          clearTimeout(timeoutDownload)
          this.isLoading = false
          mainWindow.setProgressBar(-1)
          if (counter < 1) {
            uiError('Download failed', 'Timeout')
          } else {
            mainWindow.setProgressBar(-1)
            this.notification(`${counter ? counter + 1 : 0} files successfully downloaded!`, filePath || saveFolder)
          }
        }
        counter++
      }
      let timeoutDownload = setTimeout(() => {
        endDownload(true)
      }, 10000)
      try {
        this.subtitlesList.map((subtitle, index) => {
          const hasExtension = subtitle.name.includes('.srt')
          let filename = hasExtension ? subtitle.name.replace(/.srt$|.str$/gi, '') : subtitle.name
          filename = `${filename}-${subtitle.langName}.srt`
          var savePath = `${saveFolder}/${filename}`
          Caption.download(subtitle, subtitle.source, savePath)
            .then(() => {
              endDownload(false, savePath)
            })
            .catch(err => {
              // console.log('[ERROR] download:', err)
              this.isLoading = false
              uiError('Download failed', err)
            })
        })
      } catch (error) {
        this.isLoading = false
        uiError('Download failed', error)
      }
    },
    subtitlecat () {
      shell.openExternal(`http://ww.subtitlecat.com/index.php?search=${this.nothingFound}`)
    }
  },
  watch: {
    search_isLoading: function (newVal, oldVal) {
      this.isLoading = newVal
    },
    subtitles: function (newVal, oldVal) {
      this.sources = [...new Set(this.subtitles.map(s => s.source))]
      // Filter list here
      this.filterSubtitles('all')
    },
    arrowNavEnter: function (newVal, oldVal) { // watch it
      if (this.subtitlesList.length > 0 && this.arrowNavPosition >= 0 && !this.actionFocused) {
        this.download(this.subtitlesList[this.arrowNavPosition])
      }
    },
    arrowNavPosition: function (newVal, oldVal) {
      var $container = this.$refs.containerSubtitlesScroll
      var containerHeight = $container.clientHeight
      var scrollTop = $container.scrollTop
      // console.log($container.scrollTop);

      if (newVal < 0 || this.$refs.item.length < 1) {
        $container.scrollTop = 0
        return
      }

      var $item = this.$refs.item[newVal]
      var itemHeight = $item.clientHeight
      var pos = $item.offsetTop - $container.offsetTop
      // console.log(pos);

      if (pos < scrollTop) {
        $container.scrollTop = pos
      } else if (pos + itemHeight > scrollTop + containerHeight) {
        $container.scrollTop = (pos + itemHeight) - containerHeight
      }
    }
  },
  mounted () {
  },
  computed: {
    calculateWidth: function (e) {
      return this.itemWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  .subtitles-wrapper {
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .subtitles-container {
    overflow: auto;
    flex: 1;
  }

  .actionsBar {
    display: flex;
    padding: 0px 25px 10px;
    min-height: 28px;

    .left {
      margin-right: auto;
      text-align: left;
    }

    .right {
      margin-left: auto;
      text-align: right;
    }

    .bar-item {
      display: inline-block;
      cursor: pointer;
      color: $grey-color;
      font-size: 13px;

      &:not(:last-child)::after {
        content: '|';
        margin: 0 7px;
      }

      button {
        position: relative;
        border: none;
        padding: 0;
        white-space: nowrap;

        &:hover, &:focus, &.active {
          color: $darkgrey-color;
        }

      }
    }
  }

  .event-toast {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    background-color: $bg-color;
    font-size: 14px;
    display: block;
    height: 28px;
  }

  .subtitles-list {
    overflow: hidden;

    .item {
      text-align: left;
      border-top: 1px solid $lightgrey-color;
      padding: 12px 25px;
      user-select: none;

      &.is-active {
        background-color: $lightgrey-color;
      }

      .item-name {
        font-size: 13px;
        //overflow-wrap: break-word;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        position: relative;
        margin-bottom: 5px;
        font-weight: 400;
        user-select: text;

        span {
          pointer-events: none;
          display: inline-block;
          transition: 0s;
        }

        &:hover span {
          position: relative;
          transition: 1s linear .3s;
        }
      }

      .item-meta {
        font-size: 11px;
        color: $grey-color;

        li {
          display: inline-block;
        }

        > *:not(:last-child)::after {
          content: ' | ';
          margin-right: 3px;
        }
      }
    }
  }
</style>
