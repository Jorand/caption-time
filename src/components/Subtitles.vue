<template>
  <div class="subtitles-wrapper">
    <div class="event-toast loader" v-if="isLoading">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="event-toast nothing" v-if="nothingFound">
      {{ $t('subtitles.nothing') }}
      <a href="" @click.prevent="subtitlecat">{{ $t('subtitles.alternative') }}</a>
    </div>
    <div class="actionsBar" v-if="subtitlesList.length">
      <ul class="left">
        <li class="bar-item">
          <button type="button" name="show-all"
            :class="{active: activeFilter === 'all'}"
            @click="filterSubtitles('all')"
            @keydown.enter="filterSubtitles('all')"
            @focus="actionFocused = true"
            @blur="actionFocused = false">{{ $t('subtitles.all') }}</button>
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
            {{ $t('subtitles.download_all') }}
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
            <li aria-label="downloads" v-if="subtitle.subInfo">{{ subtitle.subInfo.downloads }} {{ $t('subtitles.downloads') }}</li>
            <li aria-label="score" v-if="subtitle.score !== 0">{{ $t('subtitles.rated') }}: {{subtitle.score}}</li>
            <li aria-label="hearingImpaired" v-if="subtitle.hearingImpaired">
              <i class="icon hearing-impaired" title="Hearing impaired">
                <!-- Icons made by https://www.flaticon.com/authors/zurb Zurb -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 554.469 554.469" enable-background="new 0 0 554.469 554.469">
                  <path d="M535.805 8.568c6.119 6.12 9.18 13.464 9.18 22.032s-3.061 15.912-9.18 22.032l-75.889 76.5c-6.119 6.12-13.26 9.18-21.42 9.18-8.568 0-15.912-3.06-22.031-9.18-6.121-6.12-9.18-13.464-9.18-22.032 0-8.976 3.059-16.32 9.18-22.032l75.887-76.5c5.713-5.712 12.955-8.568 21.729-8.568 8.768 0 16.01 2.856 21.724 8.568zm-378.828 337.824c5.712-5.712 12.954-8.565 21.726-8.565s16.014 2.854 21.726 8.565c6.12 6.12 9.18 13.467 9.18 22.032 0 9.384-3.06 16.729-9.18 22.032l-138.312 139.536c-6.12 6.12-13.26 9.18-21.42 9.18-8.568 0-15.912-3.06-22.032-9.18s-9.18-13.464-9.18-22.032c0-8.976 3.06-16.32 9.18-22.032l138.312-139.536zm133.416-101.592c0-10.608-3.771-19.788-11.322-27.54-7.548-7.752-16.83-11.628-27.846-11.628-10.608 0-19.788 3.876-27.54 11.628-7.752 7.752-11.628 16.932-11.628 27.54 0 6.936-2.244 12.648-6.732 17.136-4.488 4.488-9.996 6.732-16.524 6.732s-12.036-2.244-16.524-6.732-6.732-10.2-6.732-17.136c0-11.832 2.244-23.052 6.732-33.66 4.488-10.608 10.608-19.788 18.36-27.54s16.83-13.872 27.234-18.36c10.404-4.488 21.522-6.732 33.354-6.732s22.95 2.244 33.354 6.732c10.402 4.488 19.48 10.608 27.232 18.36 7.752 7.752 13.871 16.932 18.359 27.54 4.488 10.608 6.73 21.828 6.73 33.66 0 6.936-2.242 12.648-6.73 17.136-4.488 4.488-9.996 6.732-16.523 6.732-6.525 0-12.037-2.244-16.521-6.732-4.489-4.488-6.733-10.2-6.733-17.136zm-39.168-176.868c23.664 0 45.901 4.488 66.708 13.464 20.811 8.976 38.965 21.318 54.469 37.026 15.504 15.708 27.744 34.068 36.723 55.08 8.975 21.012 13.463 43.35 13.463 67.014 0 20.4-3.467 40.392-10.404 59.976-.813 2.04-1.631 3.468-2.447 4.284-4.486 8.565-8.977 16.521-13.465 23.865-4.08 6.528-8.465 13.362-13.156 20.504-4.691 7.141-9.076 13.156-13.156 18.055-.816 1.224-1.836 2.448-3.063 3.672-1.225 1.224-2.447 2.652-3.672 4.284-5.713 6.525-9.895 12.138-12.547 16.83-2.652 4.689-3.773 12.342-3.365 22.948.816 22.031 1.021 38.249.611 48.653-.408 10.404-1.223 18.666-2.447 24.786-3.672 21.216-12.955 37.536-27.846 48.96-14.895 11.424-35.6 17.136-62.119 17.136h-1.224c-7.344 0-13.668-2.649-18.972-7.956-5.304-5.304-8.16-11.832-8.568-19.584-.408-3.672.102-7.239 1.53-10.71 1.428-3.468 3.366-6.426 5.814-8.874 5.304-6.12 11.832-9.18 19.584-9.18 8.568-.408 15.198-1.224 19.89-2.448s8.264-2.649 10.709-4.283c2.449-1.633 3.98-3.364 4.592-5.2s1.121-3.774 1.529-5.814l.611-3.06c.814-4.488 1.225-12.444 1.225-23.868s-.205-23.868-.609-37.332c-.408-10.608.305-19.89 2.141-27.846s4.184-14.994 7.039-21.114c2.854-6.12 6.119-11.526 9.791-16.218s7.344-9.078 11.016-13.158c1.227-1.227 3.063-3.468 5.51-6.732 2.447-2.854 5.201-6.63 8.264-11.32 3.059-4.691 6.221-9.59 9.484-14.688 3.266-5.1 6.223-9.996 8.873-14.688 2.652-4.691 4.998-8.672 7.037-11.936 2.041-5.712 3.57-11.73 4.592-18.054 1.02-6.324 1.529-12.954 1.529-19.89 0-15.912-3.061-31.008-9.18-45.288-6.121-14.28-14.383-26.622-24.787-37.026s-22.643-18.666-36.719-24.786c-14.076-6.12-29.071-9.18-44.982-9.18-15.912 0-30.906 3.06-44.982 9.18-14.076 6.12-26.316 14.382-36.72 24.786-10.404 10.404-18.666 22.746-24.786 37.026s-9.18 29.376-9.18 45.288c0 7.752-2.652 14.382-7.956 19.89-5.304 5.508-11.832 8.262-19.584 8.262s-14.382-2.754-19.89-8.262c-5.508-5.508-8.262-12.138-8.262-19.89 0-23.664 4.488-46.002 13.464-67.014s21.216-39.372 36.72-55.08 33.66-28.05 54.468-37.026c20.802-8.976 43.038-13.464 66.702-13.464z"/>
                </svg>
              </i>
            </li>
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
          color: $black-color;
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

  .hearing-impaired {
    fill: $grey-color;
    display: inline-block;
    width: 10px;
    height: 10px;
    vertical-align: middle;
    padding: 0;

    svg {
      margin-top: -8px;
    }
  }
</style>
